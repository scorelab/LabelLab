#!/usr/bin/env node
require("dotenv").config()

var passport = require("passport")
var OAuthUser = require("../models/oauth_user")
var GitHubStrategy = require("passport-github").Strategy

passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: "http://127.0.0.1:5000/api/v1/auth/github/callback"
		},
		function(accessToken, refreshToken, profile, cb) {
			OAuthUser.findOne({ githubId: profile.id })
				.then(currentUser => {
					if (currentUser) {
						return cb(null, currentUser)
					} else {
						new OAuthUser({
							accessToken: accessToken,
							githubId: profile.id,
							username: profile.displayName,
							thumbnail: profile._json.avatar_url
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
