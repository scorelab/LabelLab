const jwt = require('jwt-simple')
const bcrypt = require('bcryptjs');
const config = require('../../config/jwtSecret')
// Load input validation
const validateRegisterInput = require('../../utils/authValidations')
	.validateRegisterInput
const validateLoginInput = require('../../utils/authValidations')
	.validateLoginInput
// Load User model
const User = require('../../models/user')

// @desc Register user
// @access Public
exports.userRegister = function(req, res, next) {
	// Form validation
	const { errors, isValid } = validateRegisterInput(req.body)
	// Check validation
	if (!isValid) {
		return res.status(400).json(errors)
	}
	const { name, username, email, password } = req.body
	User.findOne({ email: email }).then(user => {
		if (user) {
			return res
				.status(400)
				.json({ msg: 'Email already exists', errField: 'email' })
		}
		const newUser = new User({
			name: name,
			username: username,
			email: email,
			password: password
		})
		
        bcrypt.genSalt(10, (err, salt)=>{
           bcrypt.hash(newUser.password,salt, (err, hash)=>{
           newUser.password = hash;
			newUser.save()
			.then(user => res.json({ user, msg: 'You are successfully registered!' }))
            .catch(err => console.log(err));
               });
            })
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
	let token = jwt.encode(payload, config.jwtSecret)
	if (token) {
		res.send({
			success: true,
			token: token,
			msg: 'You are successfully logged in!'
		})
	} else {
		return res.status(400).json({ message: 'Error in token generation!' })
	}
}

// @desc Create google user sent from mobile oauth client
// @access Public
exports.googleUserCreate = function(req, res, next) {
	if (
		req &&
		req.body &&
		req.body.id &&
		req.body.displayName &&
		req.body.photoUrl &&
		req.body.email &&
		req.body.accessToken
	) {
		const { accessToken, id, displayName, photoUrl, email } = req.body
		User.findOne({ googleId: id })
			.then(currentUser => {
				if (currentUser) {
					req['user'] = currentUser
					next()
				} else {
					new User({
						accessToken: accessToken,
						googleId: id,
						username: displayName,
						thumbnail: photoUrl,
						email: email
					})
						.save()
						.then(newUser => {
							req['user'] = newUser
							next()
						})
				}
			})
			.catch(err => {
				console.log(err)
			})
	} else res.status(400).send({ success: false, msg: 'Invalid Data' })
}
