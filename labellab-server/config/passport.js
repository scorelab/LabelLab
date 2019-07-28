const local = require("passport-local")
const passport = require("passport")
// the token strategy
const jwtstrat = require("passport-jwt").Strategy
const extractjwt = require("passport-jwt").ExtractJwt
const config = require("./jwtSecret")

// Load User model
const User = require("../models/user")

const locallogin = new local(
	{ usernameField: "email" },
	(email, password, done) => {
		//find a user with the supplied email
		User.findOne({ email: email }, (err, user) => {
			//if err, then propogate error down the middleware
			if (err) {
				return done(err, false)
			}
			// if no error, but no user for given email, propogate user as false down the middleware
			if (!user) {
				return done(null, false)
			}

			//after this point, we have succesfully got the user from User.find as -> user

			//this is the rewritten function in mongoose (in the file User.js in models)
			user.comparePassword(password, (err, isMatch) => {
				if (err) {
					console.log("error here")
					return done(err)
				}
				if (!isMatch) {
					return done(null, false)
				}
				//this returns all the details of the user down the middleware, already having matched the hashed passwords
				return done(null, user)
			})
		})
	}
)

const jwtoptions = {
	jwtFromRequest: extractjwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.jwtSecret
}

// initialising the JWT Strategy
const jwtLogin = new jwtstrat(jwtoptions, function(payload, done) {
	User.findById(payload.sub, (err, user) => {
		if (err) {
			return done(err, false)
		}

		if (user) {
			return done(null, user)
		}

		return done(null, false)
	})
})

passport.use(locallogin)
passport.use(jwtLogin)
