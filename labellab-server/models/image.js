const mongoose = require("mongoose")

const ImageSchema = new mongoose.Schema({
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project"
	},
	image_name: {
		type: String,
		required: true
	},
	image_url: {
		type: String,
		required: true
	},
	labelData: {
		type: Object
	},
	height: {
		type: Number
	},
	width: {
		type: Number
	},
	created_at: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model("Image", ImageSchema)
