let fs = require("fs")
const Image = require("../../models/image")
const Project = require("../../models/project")

exports.postImage = function(req, res) {
	if (
		req &&
		req.body &&
		req.params &&
		req.params.project_id &&
		req.body.image &&
		req.body.project_id &&
		req.body.image_name &&
		req.body.format
	) {
		let data = {
			id: req.user.id,
			image: req.body.image,
			image_name: req.body.image_name,
			format: req.body.format,
			project: req.params.project_id
		}
		let baseImg = data.image.split(",")[1]
		let binaryData = new Buffer(baseImg, "base64")
		let ext = data.format.split("/")[1]
		let updateData = { image_url: `${data.id}${Date.now()}.${ext}` }

		fs.writeFile(
			`./public/uploads/${updateData.image_url}`,
			binaryData,
			async err => {
				if (err) {
					return res.status(400).send({ success: false, msg: err })
				} else {
					const newImage = new Image({
						project: req.body.project_id,
						image_url: updateData.image_url,
						image_name: data.image_name
					})
					newImage.save(function(err, image) {
						if (err) {
							return res
								.status(400)
								.send({ success: false, msg: "Unable to Add Image" })
						} else if (image._id) {
							Project.updateOne(
								{ _id: req.body.project_id },
								{ $addToSet: { image: image._id } }
							).exec(function(err, project) {
								if (err) {
									return res.status(400).send({
										success: false,
										msg: "Cannot Append image",
										error: err
									})
								}
								return res.json({
									success: true,
									msg: "Image Successfully Posted",
									body: image
								})
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

exports.fetchImage = function(req, res) {
	if (req && req.params && req.params.project_id) {
		Project.find({
			_id: req.params.project_id
		})
			.select("project_name")
			.populate("image")
			.exec(function(err, project) {
				if (err) {
					return res.status(400).send({
						success: false,
						msg: "Unable to connect to database. Please try again.",
						error: err
					})
				}
				if (!project) {
					return res
						.status(400)
						.send({ success: false, msg: "Project not found" })
				} else {
					return res.json({
						success: true,
						msg: "Project images data Found",
						body: project
					})
				}
			})
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}

exports.fetchImageId = function(req, res) {
	if (req && req.params && req.params.image_id) {
		Image.findOne({
			_id: req.params.image_id
		})
			.select("height width labelData image_name image_url created_at")
			.exec(function(err, image) {
				if (err) {
					return res.status(400).send({
						success: false,
						msg: "Unable to connect to database. Please try again.",
						error: err
					})
				}
				if (!image) {
					return res
						.status(400)
						.send({ success: false, msg: "Image not found" })
				} else {
					return res.json({
						success: true,
						msg: "Image Data Found",
						body: image
					})
				}
			})
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}

exports.updateLabels = function(req, res) {
	if (req && req.params && req.params.image_id) {
		let data = req.body
		Image.findOneAndUpdate(
			{
				_id: req.params.image_id
			},
			{ height: data.height, width: data.width, labelData: data.labels },
			{ new: true }
		).exec(function(err, image) {
			if (err) {
				return res.status(400).send({
					success: false,
					msg: "Unable to connect to database. Please try again.",
					error: err
				})
			}
			return res.json({
				success: true,
				msg: "Label Data saved!",
				image: image
			})
		})
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}

exports.deleteImage = function(req, res) {
	if (req && req.params && req.params.image_id) {
		Image.findOneAndDelete({
			_id: req.params.image_id
		}).exec(function(err, image) {
			if (err) {
				return res.status(400).send({
					success: false,
					msg: "Unable to connect to database. Please try again.",
					error: err
				})
			} else {
        Project.findOneAndUpdate(
          { _id: image.project },
          { $pull: { image: req.params.image_id } }
        ).exec(function(err, project) {
          if (err) {
            return res.status(400).send({
              success: false,
              msg: "Cannot delete image",
              error: err
            })
          }
          return res.json({
            success: true,
            msg: "Image deleted successfully!"
          })
        })
      }
		})
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}
