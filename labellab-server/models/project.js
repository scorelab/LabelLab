const mongoose = require("mongoose")

const ProjectSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	projectName: {
		type: String,
		required: true
	},
	projectDescription: {
		type: String,
		default: "Image labelling"
	},
	createdAt: {
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
