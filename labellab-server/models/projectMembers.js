const mongoose = require('mongoose')

const ProjectMembersSchema = new mongoose.Schema({
	member: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	projectId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	role: {
		type: String,
		default: 'Member'
	}
})

module.exports = mongoose.model('ProjectMembers', ProjectMembersSchema)
