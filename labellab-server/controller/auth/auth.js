const jwt = require('jwt-simple')
const config = require('../../config/jwtSecret')
// Load input validation
const validateRegisterInput = require('../../utils/authValidations')
	.validateRegisterInput
const validateLoginInput = require('../../utils/authValidations')
	.validateLoginInput
// Load User model
const User = require('../../models/user')

const crypto = require('crypto')

const nodemailer = require('nodemailer');

const bcrypt = require('bcryptjs')

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
		newUser
			.save()
			.then(user => res.json({ user, msg: 'You are successfully registered!' }))
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

exports.resetPassword = function (req, res, next) {
	if (
		req &&
		req.body &&
		req.body.email
	) {
	const email = req.body.email
	User.findOne({email: email})
		.then(function (user) {
		if (!user) {
			return res
			.status(400)
			.json({ msg: 'Email not found', errField: 'email' })
		}else{
		token = crypto.randomBytes(32).toString('hex') //creating the token to be sent to the forgot password form 

        bcrypt.genSalt(10, (err, salt) => {

		bcrypt.hash(token, salt, function (err, hash) {//hashing the password to store in the db node.js
		if (err) throw err
		User.findOneAndUpdate({ email: email},{
			$set:{
				resetPasswordToken: hash,
			    resetPasswordExpires: Date.now() + 3600000,
			}})
			.then(function (item) {
			if (!item)
				return res.status(404).send({ success: false, msg: 'Failed to update the User collection' })
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: `${process.env.EMAIL_ADDRESS}`,
					pass: `${process.env.EMAIL_PASSWORD}`,
				}});
			const mailOptions = {
				from: `${process.env.EMAIL_ADDRESS}`,
				to: `${user.email}`,
				subject: 'Link To Reset Password',
				text:
					'You are receiving this because you have requested the reset of the password for your LabelLab account.\n\n'
					+ 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
					+ `http://${process.env.REACT_APP_HOST}/reset/${user._id}/${token}\n\n`
					+ 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
				};

			transporter.sendMail(mailOptions, (err, response) => {
				if (err) {
					return res.status(400).json({ msg: 'Email not found', errField: 'email' })
				} else {
					console.log('here is the res: ', response);
					res.status(200).json('recovery email sent');
				}
			});
		  })
		})
	  })
	}})
  }
}

exports.resetPasswordAuthenticate = async function(req, res, next){
	if (req && 
		req.params && 
		req.params.user_id && 
		req.params.token
	) {
	const { token } = req.params
	const id = req.params.user_id

	await User.findOne({ 
		_id: id, 
		resetPasswordExpires: {
		$gt : Date.now()
	  }, 
	}).then((user) => {
      if (user === null) {
        res.status(404).json({ success: false, msg: 'No user found' });
      } else {
	bcrypt.compare(token, user.resetPasswordToken, function(err, response) {
		if (response){
			res.status(200).json({
				username: user.username,
				email:user.email,
				msg: 'password reset link a-ok',
			})
		}else{
			return res.json({success: false, msg: 'Token Invalid'});
		}})
      }
    });
  }else{
	res.status(400).json({ success: false, msg: 'Invalid Data' })
  }
}

exports.updatePassword = function(req, res, next){
	if(
		req &&
		req.body &&
		req.body.email &&
		req.body.username &&
		req.body.password &&
		req.body.resetPasswordToken 
	  ){  
		  User.findOne({
		  username: req.body.username,
		  email:req.body.email,
		  resetPasswordExpires: {
			$gt : Date.now()
		  },
	  }).then(user => {
		if (user == null) {
		  res.status(403).json({msg:'password reset link is invalid or has expired'});
		} else if (user != null) {
			bcrypt.compare(req.body.resetPasswordToken, user.resetPasswordToken, function(err, response) {
				if (response){
				bcrypt.genSalt(10,(err,salt)=>{
					bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
					if (err) throw err
					User.findOneAndUpdate({
					email:req.body.email,
					username:req.body.username},{
					$set:{
					password: hashedPassword,
					resetPasswordToken: null,
					resetPasswordExpires: null,
				}}).then(() => {
					res.status(200).json({ msg: 'password updated' });
				});
				})})
					}})
				}else{
					return res.json({success: false, msg: 'Token Invalid'});
				}})
	  }
		  
}

