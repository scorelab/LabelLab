let User = require('../../models/user')

exports.userInfo = function(req, res) {
	User.findOne({
		email: req.user.email
	})
		.select('name email thumbnail googleId githubId username profileImage')
		.exec(function(err, user) {
			if (err) {
				return res.status(400).send({
					success: false,
					msg: 'Unable to connect to database. Please try again.',
					error: err
				})
			}
			if (!user) {
				return res.status(400).send({ success: false, msg: 'User not found' })
			} else {
				return res.json({ success: true, msg: 'User Data Found', body: user })
			}
		})
}

// exports.searchUser = function(req, res) {
// 	if (req && req.query && req.query.email) {
// 		User.findOne({
// 			email: req.query.email
// 		})
// 			.select(
// 				"name email thumbnail googleId githubId username profileImage project"
// 			)
// 			.exec(function(err, user) {
// 				if (err) {
// 					return res.status(400).send({
// 						success: false,
// 						msg: "Unable to connect to database. Please try again.",
// 						error: err
// 					})
// 				}
// 				if (!user) {
// 					return res.status(400).send({ success: false, msg: "User not found" })
// 				} else {
// 					return res.json({ success: true, msg: "User Data Found", body: user })
// 				}
// 			})
// 	}
// }
exports.searchUser = function(req, res) {
	if (req && req.params && req.params.query) {
		User.find(
			{
				email: { $regex: req.params.query, $options: 'i' }
			},
			function(err, user) {
				if (err) return console.log(err)
				res.json({
					success: true,
					body: user
				})
			}
		)
	} else {
		return res.status(400).send({ success: false, msg: 'Invalid Params' })
	}
}

exports.countInfo = function(req, res) {
	User.findOne({
		_id: req.user._id
	})
		.select('email')
		.populate('project')
		.exec(function(err, user) {
			if (err) {
				return res.status(400).send({
					success: false,
					msg: 'Unable to connect to database. Please try again.',
					error: err
				})
			}
			if (!user) {
				return res.status(400).send({ success: false, msg: 'User not found' })
			} else {
				let data = {
					totalProjects: user.project.length,
					totalImages: 0,
					totalLabels: 0
				}
				user.project.map((project, index) => {
					data.totalImages += project.image.length
					data.totalLabels += project.labels.length
				})

				return res.json({ success: true, body: data })
			}
		})
}

exports.userUploadImage = function(req, res) {
	if (req && req.body && req.body.image && req.body.format) {
		const { id, email } = req.user
		const { image, format } = req.body
		let data = {
			id: id,
			email: email,
			img: image,
			format: format
		}
		let baseImg = data.img.split(',')[1]
		let binaryData = new Buffer(baseImg, 'base64')
		let ext = data.format.split('/')[1]
		let updateData = { profileImage: `${data.id}.${ext}` }
		const url = `/public/img/${updateData.profileImage}`
		require('fs').writeFile(
			`./public/img/${updateData.profileImage}`,
			binaryData,
			function(err) {
				if (err) {
					return res
						.status(400)
						.send({ success: false, msg: 'something went wrong' })
				} else {
					User.findOneAndUpdate(
						{
							email: data.email
						},
						{
							profileImage:
								'http://localhost:4000/static/img/' + updateData.profileImage
						}
					).exec(function(err) {
						if (err)
							return res.status(400).send({
								success: false,
								msg: 'Unable To Upload Image. Please Try Again.'
							})
						res.json({
							success: true,
							body: url,
							msg: 'Image Uploaded Successfully.'
						})
					})
				}
			}
		)
	} else res.status(400).send({ success: false, msg: 'Invalid Data' })
}
