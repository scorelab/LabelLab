const mongoose = require('mongoose')

var LabelSchema = new mongoose.Schema({
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	},
	id: {
		type: String,
		unique: true
	},
	name: {
		type: String
	},
	type: {
		type: String
	}
})

module.exports = mongoose.model('Label', LabelSchema)
