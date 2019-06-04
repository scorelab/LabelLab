const mongoose = require("mongoose")

// Create Schema
const OAuthUserSchema = new mongoose.Schema({
	accessToken: {
		type: String
	},
	username: {
		type: String,
		required: true
	},
	googleId: {
		type: String
	},
	githubId: {
		type: String
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	thumbnail: {
		type: String
	}
})
module.exports = mongoose.model("OAuthuser", OAuthUserSchema)
