const jwt = require("jwt-simple")
const config = require("../config/jwt_secret")
// Load input validation
const validateRegisterInput = require("../utils/auth_validations")
	.validateRegisterInput
const validateLoginInput = require("../utils/auth_validations")
	.validateLoginInput
// Load User model
const User = require("../models/user")

// @desc Register user
// @access Public
exports.userRegister = function(req, res, next) {
	// Form validation
	const { errors, isValid } = validateRegisterInput(req.body)
	// Check validation
	if (!isValid) {
		return res.status(400).json(errors)
	}
	User.findOne({ email: req.body.email }).then(user => {
		if (user) {
			return res
				.status(400)
				.json({ msg: "Email already exists", err_field: "email" })
		}
		const newUser = new User({
			name: req.body.name,
			username: req.body.username,
			email: req.body.email,
			password: req.body.password
		})
		newUser
			.save()
			.then(user => res.json({ user, msg: "You are successfully registered!" }))
			.catch(err => console.log(err))
	})
}

// @desc Login user and return JWT token
// @access Public
exports.userLogin = function(req, res, next) {
	// Form validation
	const { errors, isValid } = validateLoginInput(req.body)
	// Check validation
	if (!isValid) {
		return res.status(400).json(errors)
	}
	const timestamp = new Date().getTime()
	let payload = {
		sub: req.user.id,
		iat: timestamp
	}
	let token = jwt.encode(payload, config.jwt_secret)
	if (token) {
		res.send({
			success: true,
			token: token,
			msg: "You are successfully logged in!"
		})
	} else {
		return res.status(400).json({ message: "Error in token generation!" })
	}
}
