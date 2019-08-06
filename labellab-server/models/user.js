const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

// Create Schema
const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: false
	},
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: false
	},
	accessToken: {
		type: String
	},
	googleId: {
		type: String
	},
	githubId: {
		type: String
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	thumbnail: {
		type: String,
		default: 'https://react.semantic-ui.com/images/avatar/large/elliot.jpg'
	},
	profileImage: {
		type: String,
		default: ''
	},
	project: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Project'
		}
	]
})
UserSchema.pre('save', function(next) {
	var newUser = this
	if (newUser.password) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) throw err
				newUser.password = hash
				next()
			})
		})
	} else {
		next()
	}
})

UserSchema.methods.comparePassword = function(password, callback) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		if (err) {
			return callback(err)
		}
		callback(null, isMatch)
	})
}
module.exports = mongoose.model('User', UserSchema)
