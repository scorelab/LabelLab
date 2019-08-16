let Image = require('../../models/image')
let Label = require('../../models/label')
let Project = require('../../models/project')
let makeid = require('../../utils/randomString').makeid

exports.createLabel = function(req, res) {
	if (req && req.body && req.body.label && req.params.projectId) {
		const { label } = req.body
		const newLabel = new Label({
			project: req.params.projectId,
			id: makeid(8),
			type: label.type,
			name: label.name
		})
		newLabel.save(function(err, label) {
			if (err) {
				return res
					.status(400)
					.send({ success: false, msg: 'Unable to Add Label' })
			}
			Project.update(
				{ _id: req.params.projectId },
				{ $addToSet: { labels: label._id } }
			).exec(function(err) {
				if (err) {
					return res.status(400).send({
						success: false,
						msg: 'Cannot Append Member',
						error: err
					})
				}
				return res.status(200).send({
					success: true,
					msg: 'Label created!',
					body: label
				})
			})
		})
	} else res.status(400).send({ success: false, msg: 'Invalid Data' })
}

exports.updateLabel = function(req, res) {
	if (req && req.body && req.params.labelId) {
		let data = req.body
		Label.findOneAndUpdate(
			{
				id: req.params.labelId
			},
			data,
			{ new: true }
		).exec(function(err, label) {
			if (err) {
				return res
					.status(400)
					.send({ success: false, msg: 'Unable to update Label' })
			}
			return res.status(200).send({
				success: true,
				msg: 'Label updated!',
				body: label
			})
		})
	} else res.status(400).send({ success: false, msg: 'Invalid Data' })
}

exports.fetchLabel = function(req, res) {
	if (req && req.body && req.params.projectId) {
		Project.findOne({
			_id: req.params.projectId
		})
			.select('project_name')
			.populate('labels')
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
						msg: 'Project Data Found',
						body: project
					})
				}
			})
	} else res.status(400).send({ success: false, msg: 'Invalid Data' })
}

exports.deleteLabel = function(req, res) {
	if (req && req.body && req.params.labelId) {
		Label.findOneAndDelete({
			_id: req.params.labelId
		}).exec(function(err, label) {
			if (err) {
				return res.status(400).send({
					success: false,
					msg: 'Unable to connect to database. Please try again.',
					error: err
				})
			}
			Project.findOneAndUpdate(
				{ _id: label._id },
				{ $pull: { labels: req.params.label_id } }
			).exec(function(err, project) {
				if (err) {
					return res.status(400).send({
						success: false,
						msg: 'Cannot delete label',
						error: err
					})
				}
				return res.json({
					success: true,
					msg: 'Removed successfully!'
				})
			})
		})
	} else res.status(400).send({ success: false, msg: 'Invalid Data' })
}
