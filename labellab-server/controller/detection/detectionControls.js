let fs = require('fs')
const Detection = require('../../models/detection')

exports.detect = function(req, res) {
    if (req && req.body && req.body.image && req.body.format) {
        const { image, format } = req.body
        let data = {
            id: req.user.id,
            image: image,
            format: format
        }
        let baseImg = data.image.split(',')[1]
        var image = new Image();
        image.src = baseImg;
        let image_width = image.width;
        let image_height = image.height;
        let binaryData = new Buffer(baseImg, 'base64')
        let ext = data.format.split('/')[1]
        let updateData = { imageUrl: `${data.id}${Date.now()}.${ext}` }

        fs.writeFile(
            `./public/detections/${updateData.imageUrl}`,
            binaryData,
            async err => {
                if (err) {
                    return res.status(400).send({ success: false, msg: err })
                } else {
                    // TODO - Integrate with the detection model

                    // Mock label creation to emulate detection model.
                    var detections = [{
                        label_name: 'Label ' + Math.floor(Math.random() * 10 + 1),
                        confidence: Math.floor(Math.random() * 50) + 50,
                        x1: Math.floor(Math.random() * image_width),
                        y1: Math.floor(Math.random() * image_height),
                        x2: Math.floor(Math.random() * image_width),
                        y2: Math.floor(Math.random() * image_height),
                    }]
                    const newDetection = new Detection({
                        imageUrl: updateData.imageUrl,
                        user: data.id,
                        detections: detections
                    })
                    newDetection.save(function(err, detection) {
                        if (err) {
                            console.log(err)
                            return res
                                .status(400)
                                .send({ success: false, msg: 'Unable to Upload Image' })
                        } else if (detection._id) {
                            return res.json({
                                success: true,
                                msg: 'Image Successfully Inferenced',
                                body: detection
                            })
                        } else {
                            return res.status(400).send({
                                success: false,
                                msg: 'Detection ID Not Found',
                                body: detection
                            })
                        }
                    })
                }
            }
        )
    } else res.status(400).send({ success: false, msg: 'Invalid Data' })
}

exports.fetchDetection = function(req, res) {
    Classification.find({
            user: req.user._id
        })
        .select('imageUrl createdAt detections')
        .exec(function(err, detection) {
            if (err) {
                return res.status(400).send({
                    success: false,
                    msg: 'Unable to connect to database. Please try again.',
                    error: err
                })
            }
            if (!detection) {
                return res
                    .status(400)
                    .send({ success: false, msg: 'Detections not found' })
            } else {
                return res.json({
                    success: true,
                    msg: 'Detection data Found',
                    body: detection
                })
            }
        })
}

exports.fetchDetectionId = function(req, res) {
    if (req && req.params && req.params.detectionId) {
        Detection.find({
                _id: req.params.detectionId
            })
            .select('imageUrl createdAt detections')
            .exec(function(err, detection) {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        msg: 'Unable to connect to database. Please try again.',
                        error: err
                    })
                }
                if (!detection) {
                    return res
                        .status(400)
                        .send({ success: false, msg: 'Detection not found' })
                } else {
                    return res.json({
                        success: true,
                        msg: 'Detection Data Found',
                        body: detection
                    })
                }
            })
    } else res.status(400).send({ success: false, msg: 'Invalid Data' })
}

exports.deleteDetectionId = function(req, res) {
    if (req && req.params && req.params.detectionId) {
        Detection.deleteOne({
            _id: req.params.detectionId
        }).exec(function(err) {
            if (err) {
                return res.status(400).send({
                    success: false,
                    msg: 'Unable to connect to database. Please try again.',
                    error: err
                })
            }
            return res.json({
                success: true,
                msg: 'Detection deleted'
            })
        })
    } else res.status(400).send({ success: false, msg: 'Invalid Data' })
}