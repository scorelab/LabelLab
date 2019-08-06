const mongoose = require('mongoose')

const ClassificationSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	imageUrl: {
		type: String,
		required: true
	},
	label: [
		{
			type: Object
		}
	],
	createdAt: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Classification', ClassificationSchema)
