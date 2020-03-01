let fs = require('fs')
const path = require('path')
let sizeOfImage = require('image-size')
const Image = require('../../models/image')
const Project = require('../../models/project')
const Label = require('../../models/label')

const ObjectID = require('mongodb').ObjectID
const builder = require('xmlbuilder');
const archiver = require('archiver');

exports.postImage = function(req, res) {
  if (
    req &&
    req.body &&
    req.params &&
    req.params.projectId &&
    req.body.images &&
    req.body.projectId &&
    req.body.imageNames &&
    req.body.format
  ) {
    const { images, imageNames, format, projectId } = req.body
    var firstImage = images[0]
    for (var i = 0; i < images.length; i++) {
      var image = images[i]
      var imageName = imageNames[i]
      let data = {
        id: req.user.id,
        image: image,
        imageName: imageName,
        format: format,
        project: req.params.projectId
      }
      let baseImg = data.image.split(',')[1]
      let binaryData = new Buffer(baseImg, 'base64')
      var dimensions = sizeOfImage(binaryData)
      let ext = data.format.split('/')[1]
      let updateData = { imageUrl: `${data.id}${Date.now()}.${ext}` }
      fs.writeFile(
        `./public/uploads/${updateData.imageUrl}`,
        binaryData,
        async err => {
          if (err) {
            return res.status(400).send({ success: false, msg: err })
          } else {
            const newImage = new Image({
              project: projectId,
              imageUrl: updateData.imageUrl,
              imageName: data.imageName,
              width: dimensions.width,
              height: dimensions.height
            })
            newImage.save(function(err, image) {
              if (err) {
                return res
                  .status(400)
                  .send({ success: false, msg: 'Unable to Add Image' })
              } else if (image._id) {
                Project.updateOne(
                  { _id: req.body.projectId },
                  { $addToSet: { image: image._id } }
                ).exec(function(err, project) {
                  if (err) {
                    return res.status(400).send({
                      success: false,
                      msg: 'Cannot Append image',
                      error: err
                    })
                  }
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
    }
    return res.json({
      success: true,
      msg: 'Images Successfully Posted',
      body: firstImage
    })
  } else res.status(400).send({ success: false, msg: 'Invalid Data' })
}

exports.fetchImage = function(req, res) {
  if (req && req.params && req.params.projectId) {
    Project.find({
      _id: req.params.projectId
    })
      .select('projectName')
      .populate('image')
      .exec(function(err, project) {
        if (err) {
          return res.status(400).send({
            success: false,
            msg: 'Unable to connect to database. Please try again.',
            error: err
          })
        }
        if (!project) {
          return res
            .status(400)
            .send({ success: false, msg: 'Project not found' })
        } else {
          return res.json({
            success: true,
            msg: 'Project images data Found',
            body: project
          })
        }
      })
  } else res.status(400).send({ success: false, msg: 'Invalid Data' })
}

exports.fetchImageId = function(req, res) {
  if (req && req.params && req.params.imageId) {
    Image.findOne({
      _id: req.params.imageId
    })
      .select('height width labelData imageName imageUrl createdAt')
      .exec(function(err, image) {
        if (err) {
          return res.status(400).send({
            success: false,
            msg: 'Unable to connect to database. Please try again.',
            error: err
          })
        }
        if (!image) {
          return res
            .status(400)
            .send({ success: false, msg: 'Image not found' })
        } else {
          return res.json({
            success: true,
            msg: 'Image Data Found',
            body: image
          })
        }
      })
  } else res.status(400).send({ success: false, msg: 'Invalid Data' })
}

exports.updateLabels = function(req, res) {
  if (req && req.params && req.params.imageId) {
    let data = req.body
    Image.findOne({
      _id: req.params.imageId
    }).exec(function(err, image) {
      if (err) {
        return res.status(400).send({
          success: false,
          msg: 'Unable to connect to database. Please try again.',
          error: err
        })
      }

      var oldLabels = image.labelData
      Image.findOneAndUpdate(
        {
          _id: req.params.imageId
        },
        {
          height: data.height,
          width: data.width,
          labelData: data.labels,
          labelled: true
        },
        { new: true }
      ).exec(function(err, image) {
        if (err) {
          return res.status(400).send({
            success: false,
            msg: 'Unable to connect to database. Please try again.',
            error: err
          })
        }

        var changedLabel = null
        for (var label in data.labels) {
          if (oldLabels) {
            if (
              oldLabels[label] &&
              oldLabels[label].length != data.labels[label].length
            ) {
              changedLabel = label
              break
            }
          } else if (data.labels[label].length === 1) {
            changedLabel = label
            break
          }
        }

        changedLabel &&
          Label.update(
            { project: ObjectID(data.projectId), id: changedLabel },
            { $inc: { count: 1 } }
          ).exec(function(err, result) {
            if (err) {
              return res.status(400).send({
                success: false,
                msg: 'Unable to connect to database. Please try again.',
                error: err
              })
            }
          })

        return res.json({
          success: true,
          msg: 'Label Data saved!',
          image: image
        })
      })
    })
  } else res.status(400).send({ success: false, msg: 'Invalid Data' })
}

exports.deleteImage = function(req, res) {
  if (req && req.body && req.body.images) {
    const imageList = req.body.images
    for (var i = 0; i < imageList.length; i++) {
      Image.findOneAndDelete({
        _id: imageList[i]
      }).exec(function(err, image) {
        if (err) {
          return res.status(400).send({
            success: false,
            msg: 'Unable to connect to database. Please try again.',
            error: err
          })
        } else {
          fs.unlinkSync(
            path.join(__dirname, '../../', `public/uploads/${image.imageUrl}`)
          )
          Project.findOneAndUpdate(
            { _id: image.project },
            { $pull: { image: req.params.imageId } }
          ).exec(function(err, project) {
            if (err) {
              return res.status(400).send({
                success: false,
                msg: 'Cannot delete image',
                error: err
              })
            }
          })
        }
      })
    }
    return res.json({
      success: true,
      msg: 'Image(s) deleted successfully!'
    })
  } else res.status(400).send({ success: false, msg: 'Invalid Data' })
}

exports.exportDataset = function(req, res) {
  `
  Example annotation:
  <annotation>
    <filename>test.png</filename>
    <size>
      <width>1250</width>
      <height>1250</height>
      <depth>3</depth>
    </size>
    <segmented>0</segmented>
    <object>
      <name>text</name>
      <truncated>0</truncated>
      <difficult>0</difficult>
      <bndbox>
        <xmin>406</xmin>
        <ymin>380</ymin>
        <xmax>850</xmax>
        <ymax>879</ymax>
      </bndbox>
    </object>
  </annotation>
  `
  function createXML(image) {
    let doc = builder.create('annotation');
    doc = doc.ele('filename').txt(image.imageName)
       .up()
       .ele('size')
       .ele('width').txt(image.width).up()
       .ele('height').txt(image.height).up()
       .ele('depth').txt('3').up()
       .up()
       .ele('segmented').txt('0')
       .up()
    // Loop over labelData keys to create bounding_boxes
    for(let labelId in image.labelData) {
      if (labelId === '__temp') continue
      Label.find({
        id: labelId
      })
        .select('name')
        .exec((err, label) => {
          const name = label[0].name
          Array.from(image.labelData[labelId]).forEach(box => {
            const [min, max] = box.points
            xmin = min.lng 
            ymin = min.lat 
            xmax = max.lng
            ymax = max.lat

            let object = builder.create('object')
            object = object
              .ele('name').txt(name)
              .up()
              object.ele('pose').txt('Unspecified')
              .up()
              object.ele('truncated').txt('0')
              .up()
              object.ele('difficult').txt('0')
              .up()
              object.ele('bndbox')
              .ele('xmin').txt(`${xmin}`).up()
              .ele('ymin').txt(`${ymin}`).up()
              .ele('xmax').txt(`${xmax}`).up()
              .ele('ymax').txt(`${ymax}`).up()
              .up()
            doc.children.push(object)
          })
        })
    }
    setTimeout(() => {
      // save the file in annotations/ directory
      const dir = './public/uploads/annotations/'

      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
      fs.appendFileSync(`${dir}${image.imageName.split('.')[0]}.xml`, doc.toString({ pretty: true }), err => {})
    }, 1000)
  }

  if (req) {
    Image.find()
      .exec(function(err, result) {
        // create annotations for all images
        Array.from(result).forEach(image => createXML(image))
        // create a zip of annotations
        const dir = './public/uploads/'
        let stream = fs.createWriteStream(`${dir}annotations.zip`);
        let archive = archiver('zip');

        archive
          .directory(`${dir}/annotations/`, false)
          .on('error', err => reject(err))
          .pipe(stream)
        
        archive.finalize()
        res.status(200).send({
          success: true,
          msg: 'Done!'
        })
      })
  } else res.status(400).send({ success: false, msg: 'Invalid Data' })
}
