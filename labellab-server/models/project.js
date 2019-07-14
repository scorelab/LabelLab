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
	],
	labels: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Label"
		}
	]
})

module.exports = mongoose.model("Project", ProjectSchema)
