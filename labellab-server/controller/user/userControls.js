let User = require("../../models/user")

exports.userInfo = function(req, res) {
	User.findOne({
		email: req.user.email
	})
		.select("name email thumbnail googleId githubId username profile_image")
		.exec(function(err, user) {
			if (err) {
				return res.status(400).send({
					success: false,
					msg: "Unable to connect to database. Please try again.",
					error: err
				})
			}
			if (!user) {
				return res.status(400).send({ success: false, msg: "User not found" })
			} else {
				return res.json({ success: true, msg: "User Data Found", body: user })
			}
		})
}

exports.countInfo = function(req, res) {
	User.findOne({
		_id: req.user._id
	})
		.select("email")
		.populate("project")
		.exec(function(err, user) {
			if (err) {
				return res.status(400).send({
					success: false,
					msg: "Unable to connect to database. Please try again.",
					error: err
				})
			}
			if (!user) {
				return res.status(400).send({ success: false, msg: "User not found" })
			} else {
				let data = {
					total_projects: user.project.length,
					total_images: 0,
					total_labels: 0
				}
				user.project.map((project, index) => {
					data.total_images += project.image.length
					data.total_labels += project.labels.length
				})

				return res.json({ success: true, body: data })
			}
		})
}

exports.userUploadImage = function(req, res) {
	if (req && req.body && req.body.image && req.body.format) {
		let data = {
			id: req.user.id,
			email: req.user.email,
			img: req.body.image,
			format: req.body.format
		}
		let baseImg = data.img.split(",")[1]
		let binaryData = new Buffer(baseImg, "base64")
		let ext = data.format.split("/")[1]
		let updateData = { profile_image: `${data.id}.${ext}` }
		const url = `/public/img/${updateData.profile_image}`
		require("fs").writeFile(
			`./public/img/${updateData.profile_image}`,
			binaryData,
			function(err) {
				if (err) {
					return res
						.status(400)
						.send({ success: false, msg: "something went wrong" })
				} else {
					User.findOneAndUpdate(
						{
							email: data.email
						},
						{
							profile_image:
								"http://localhost:4000/static/img/" + updateData.profile_image
						}
					).exec(function(err) {
						if (err)
							return res.status(400).send({
								success: false,
								msg: "Unable To Upload Image. Please Try Again."
							})
						res.json({
							success: true,
							body: url,
							msg: "Image Uploaded Successfully."
						})
					})
				}
			}
		)
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}
