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
      scope: ["read:user", "user:email"],
		},
		function(accessToken, refreshToken, profile, cb) {
      primaryEmail = profile.emails.filter(email => email.primary == true)[0]
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
							email: primaryEmail.value
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
