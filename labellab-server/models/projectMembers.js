const mongoose = require("mongoose")

const ProjectMembersSchema = new mongoose.Schema({
	member: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	project_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project"
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	role: {
		type: String,
		default: "Member"
	}
})

module.exports = mongoose.model("ProjectMembers", ProjectMembersSchema)
