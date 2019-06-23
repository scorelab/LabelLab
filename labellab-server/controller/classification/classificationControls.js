let fs = require("fs")
const Image = require("../../models/image")
const Classification = require("../../models/classification")

exports.classify = function(req, res) {
	if (
		req &&
		req.body &&
		req.body.image &&
		req.body.format
	) {
		let data = {
			id: req.user.id,
			image: req.body.image,
			format: req.body.format,
		}
		let baseImg = data.image.split(",")[1]
		let binaryData = new Buffer(baseImg, "base64")
		let ext = data.format.split("/")[1]
		let updateData = { image_url: `${data.id}${Date.now()}.${ext}` }

		fs.writeFile(
			`./public/classifications/${updateData.image_url}`,
			binaryData,
			async err => {
				if (err) {
					return res.status(400).send({ success: false, msg: err })
				} else {
          // TODO - Integrate with the classification model

          // Mock label creation to emulate classification model.
          var label = [
            { label_name: "Label " + Math.floor((Math.random() * 10) + 1) }
          ];
					const newClassification = new Classification({
						image_url: updateData.image_url,
            user: data.id,
            label: label
					})
					newClassification.save(function(err, image) {
						if (err) {
              console.log(err)
							return res
								.status(400)
								.send({ success: false, msg: "Unable to Upload Image" })
						} else if (image._id) {
              return res.json({
                success: true,
                msg: "Image Successfully Classified",
                body: image
              })
						} else {
							return res.status(400).send({
								success: false,
								msg: "Image ID Not Found",
								body: image
							})
						}
					})
				}
			}
		)
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}

exports.fetchClassification = function(req, res) {
  Classification.find({
    user: req.user._id
  })
    .select("image_url created_at label")
    .exec(function(err, classification) {
      if (err) {
        return res.status(400).send({
          success: false,
          msg: "Unable to connect to database. Please try again.",
          error: err
        })
      }
      if (!classification) {
        return res
          .status(400)
          .send({ success: false, msg: "Classifications not found" })
      } else {
        return res.json({
          success: true,
          msg: "Classification data Found",
          body: classification
        })
      }
    })
}

exports.fetchClassificationId = function(req, res) {
	if (req && req.params && req.params.classification_id) {
		Classification.find({
			_id: req.params.classification_id
		})
			.select("image_url created_at label")
			.exec(function(err, classification) {
				if (err) {
					return res.status(400).send({
						success: false,
						msg: "Unable to connect to database. Please try again.",
						error: err
					})
				}
				if (!classification) {
					return res
						.status(400)
						.send({ success: false, msg: "Classification not found" })
				} else {
					return res.json({
						success: true,
						msg: "Classification Data Found",
						body: classification
					})
				}
			})
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}

exports.deleteClassificationId = function(req, res) {
	if (req && req.params && req.params.classification_id) {
		Classification.deleteOne({
			_id: req.params.classification_id
		})
			.exec(function(err) {
				if (err) {
					return res.status(400).send({
						success: false,
						msg: "Unable to connect to database. Please try again.",
						error: err
					})
				}
        return res.json({
          success: true,
          msg: "Classification deleted"
        })
			})
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}