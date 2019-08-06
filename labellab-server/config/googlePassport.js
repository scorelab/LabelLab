#!/usr/bin/env node
require('dotenv').config()

var User = require('../models/user')
var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

if (process.env.GOOGLE_CLIENT_ID) {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL:
					process.env.HOST +
					':' +
					process.env.PORT +
					'/api/v1/auth/google/callback'
			},
			function(accessToken, refreshToken, profile, done) {
				User.findOne({ googleId: profile.id })
					.then(currentUser => {
						if (currentUser) {
							return done(null, currentUser)
						} else {
							new User({
								accessToken: accessToken,
								googleId: profile.id,
								username: profile.displayName,
								thumbnail: profile._json.picture,
								email: profile._json.email,
								name: profile.displayName
							})
								.save()
								.then(newUser => {
									return done(null, newUser)
								})
						}
					})
					.catch(err => {
						console.log(err)
					})
			}
		)
	)
}
