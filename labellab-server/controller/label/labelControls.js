let Image = require("../../models/image")
let Label = require("../../models/label")
let Project = require("../../models/project")
let makeid = require("../../utils/randomString").makeid

exports.postLabel = function(req, res) {
	if (req && req.body && req.params && req.params.image_id && req.body.label) {
		let data = {
			label: req.body.label,
			image_id: req.params.image_id
		}
		data.label.map((label, index) => {
			let tmp = label
			tmp["image"] = data.image_id
			label = tmp
		})
		Label.collection.insertMany(data.label, function(err, label) {
			if (err) {
				return res.status(400).send({
					success: false,
					msg: "Unable To Upload Image. Please Try Again."
				})
			} else {
				Image.updateMany(
					{ _id: data.image_id },
					{ $addToSet: { label: label.ops } }
				).exec(function(err, image) {
					console.log(image)
					if (err) {
						return res
							.status(400)
							.send({ success: false, msg: "Cannot Append image", error: err })
					}
					return res.json({ success: true, msg: "Image Successfully Posted" })
				})
			}
		})
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}

exports.createLabel = function(req, res) {
	if (req && req.body && req.body.label) {
		console.log(req.body)
		const newLabel = new Label({
			id: makeid(8),
			type: req.body.label.type,
			name: req.body.label.name
		})
		newLabel.save(function(err, label) {
			if (err) {
				return res
					.status(400)
					.send({ success: false, msg: "Unable to Add Label" })
			}
			Project.update(
				{ _id: req.params.project_id },
				{ $addToSet: { labels: label._id } }
			).exec(function(err) {
				if (err) {
					return res.status(400).send({
						success: false,
						msg: "Cannot Append Member",
						error: err
					})
				}
				return res.status(200).send({
					success: true,
					msg: "Label created!",
					body: label
				})
			})
		})
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}

exports.updateLabel = function(req, res) {
	if (req && req.body && req.params.label_id) {
		let data = req.body
		Label.findOneAndUpdate(
			{
				id: req.params.label_id
			},
			data,
			{ new: true }
		).exec(function(err, label) {
			if (err) {
				return res
					.status(400)
					.send({ success: false, msg: "Unable to update Label" })
			}
			return res.status(200).send({
				success: true,
				msg: "Label updated!",
				body: label
			})
		})
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}

exports.fetchLabel = function(req, res) {
	if (req && req.body && req.params.project_id) {
		Project.findOne({
			_id: req.params.project_id
		})
			.select("project_name")
			.populate("labels")
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
						msg: "Project Data Found",
						body: project
					})
				}
			})
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}
