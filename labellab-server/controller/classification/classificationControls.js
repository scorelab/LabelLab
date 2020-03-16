let fs = require('fs')
const Image = require('../../models/image')
const Classification = require('../../models/classification')
const request = require('request')

exports.classify = function(req, res) {
	if (req && req.body && req.body.image && req.body.format) {
		const { image, format } = req.body
		let data = {
			id: req.user.id,
			image: image,
			format: format
		}
		let baseImg = data.image.split(',')[1]
		let binaryData = new Buffer(baseImg, 'base64')
		let ext = data.format.split('/')[1]
		let updateData = { imageUrl: `${data.id}${Date.now()}.${ext}` }

		fs.writeFile(
			`./public/classifications/${updateData.imageUrl}`,
			binaryData,
			async err => {
				if (err) {
					return res.status(400).send({ success: false, msg: err })
				} else {

                    // Integration with the classification model
                    function doRequest() {
                        return new Promise(function (resolve, reject) {
                            const post = {
                                image,
                                filename: updateData.imageUrl
                            }
                            let url = process.env.ML_HOST + ':' + process.env.ML_PORT
                            request.post(url, post, function (error, res, body) {
                                if (body) {
                                    resolve(body)
                                } else if (error) {
                                    reject(error)
                                } else {
                                    reject('Not sufficient data to analyze')
                                }
                            })
                        })
                    }

                    var label = []
                    doRequest().then(body => {
                        label = JSON.parse(body).label
                    }).catch(err => {
                        console.log(err)
                    })

					const newClassification = new Classification({
						imageUrl: updateData.imageUrl,
						user: data.id,
						label: label
					})
					newClassification.save(function(err, image) {
						if (err) {
							console.log(err)
							return res
								.status(400)
								.send({ success: false, msg: 'Unable to Upload Image' })
						} else if (image._id) {
							return res.json({
								success: true,
								msg: 'Image Successfully Classified',
								body: image
							})
						} else {
							return res.status(400).send({
								success: false,
								msg: 'Image ID Not Found',
								body: image
							})
						}
					})
				}
			}
		)
	} else res.status(400).send({ success: false, msg: 'Invalid Data' })
}

exports.fetchClassification = function(req, res) {
	Classification.find({
		user: req.user._id
	})
		.select('imageUrl createdAt label')
		.exec(function(err, classification) {
			if (err) {
				return res.status(400).send({
					success: false,
					msg: 'Unable to connect to database. Please try again.',
					error: err
				})
			}
			if (!classification) {
				return res
					.status(400)
					.send({ success: false, msg: 'Classifications not found' })
			} else {
				return res.json({
					success: true,
					msg: 'Classification data Found',
					body: classification
				})
			}
		})
}

exports.fetchClassificationId = function(req, res) {
	if (req && req.params && req.params.classificationId) {
		Classification.find({
			_id: req.params.classificationId
		})
			.select('imageUrl createdAt label')
			.exec(function(err, classification) {
				if (err) {
					return res.status(400).send({
						success: false,
						msg: 'Unable to connect to database. Please try again.',
						error: err
					})
				}
				if (!classification) {
					return res
						.status(400)
						.send({ success: false, msg: 'Classification not found' })
				} else {
					return res.json({
						success: true,
						msg: 'Classification Data Found',
						body: classification
					})
				}
			})
	} else res.status(400).send({ success: false, msg: 'Invalid Data' })
}

exports.deleteClassificationId = function(req, res) {
	if (req && req.params && req.params.classificationId) {
		Classification.deleteOne({
			_id: req.params.classificationId
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
				msg: 'Classification deleted'
			})
		})
	} else res.status(400).send({ success: false, msg: 'Invalid Data' })
}
