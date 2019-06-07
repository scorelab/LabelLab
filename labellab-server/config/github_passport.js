#!/usr/bin/env node
require("dotenv").config()

var passport = require("passport")
var User = require("../models/user")
var GitHubStrategy = require("passport-github").Strategy

passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL:
				process.env.HOST +
				":" +
				process.env.PORT +
				"/api/v1/auth/github/callback"
		},
		function(accessToken, refreshToken, profile, cb) {
			User.findOne({ githubId: profile.id })
				.then(currentUser => {
					if (currentUser) {
						return cb(null, currentUser)
					} else {
						new User({
							accessToken: accessToken,
							githubId: profile.id,
							username: profile.displayName,
							thumbnail: profile._json.avatar_url,
							email: profile._json.email
						})
							.save()
							.then(newUser => {
								return cb(null, newUser)
							})
					}
				})
				.catch(err => {
					console.log(err)
				})
		}
	)
)
