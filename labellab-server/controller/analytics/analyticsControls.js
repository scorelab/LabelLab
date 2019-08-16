let getColor = require('../../utils/color').getColor
let getMonths = require('../../utils/months').getMonths
let getLabelData = require('../../utils/labelData').getLabelData
let Label = require('../../models/label')

exports.timeLabel = function(req, res) {
	if (req && req.params && req.params.projectId) {
		Label.find({ project: req.params.projectId }).exec(function(err, labels) {
			if (err) {
				return res.status(400).send({
					success: false,
					msg: 'Cannot fetch dataset',
					error: err
				})
			}
			let labelData = []
			if (labels.length > 0) {
				labels.map(label => {
					let tempData = new Date()
					tempData = label.createdAt
					labelData.push(tempData.getMonth())
				})
			} else {
				return res.status(200).send({
					success: false,
					msg: 'Dataset empty!',
					error: err
				})
			}
			const data = {
				labels: getMonths(6),
				datasets: [
					{
						label: 'Number of Labels',
						data: getLabelData(labelData),
						backgroundColor: getColor(6)
					}
				]
			}
			return res.status(200).send({
				success: true,
				body: data
			})
		})
	} else res.status(400).send({ success: false, msg: 'Invalid Data' })
}
