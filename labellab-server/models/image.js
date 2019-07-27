const mongoose = require("mongoose")

const ImageSchema = new mongoose.Schema({
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project"
	},
	imageName: {
		type: String,
		required: true
	},
	imageUrl: {
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
	labelled: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model("Image", ImageSchema)
