let Image = require("../../models/image")
let Label = require("../../models/label")

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
