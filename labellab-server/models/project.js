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
	project_description: {
		type: String,
		default: "Image labelling"
	},
	project_image: {
		type: String
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	image: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Image"
		}
	],
	members: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "ProjectMembers"
		}
	]
})

module.exports = mongoose.model("Project", ProjectSchema)
