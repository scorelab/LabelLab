const mongoose = require("mongoose")

const ProjectSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	project_name: {
		type: String,
		required: true
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	image:[{
		type: mongoose.Schema.Types.ObjectId, 
		ref: "Image"
	}]
})

module.exports = mongoose.model("Project", ProjectSchema)
