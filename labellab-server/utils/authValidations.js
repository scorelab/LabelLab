const Validator = require('validator')
const isEmpty = require('is-empty')

exports.validateRegisterInput = function(data) {
	let errors = {}
	// Convert empty fields to an empty string so we can use validator functions
	data.name = !isEmpty(data.name) ? data.name : ''
	data.username = !isEmpty(data.username) ? data.username : ''
	data.email = !isEmpty(data.email) ? data.email : ''
	data.password = !isEmpty(data.password) ? data.password : ''
	data.password2 = !isEmpty(data.password2) ? data.password2 : ''

	// Name checks
	if (Validator.isEmpty(data.name)) {
		errors.msg = 'Name field is required'
		errors.errField = 'name'
	}

	//Username checks
	if (Validator.isEmpty(data.username)) {
		errors.msg = 'Username field is required'
		errors.errField = 'username'
	}

	// Email checks
	if (Validator.isEmpty(data.email)) {
		errors.msg = 'Email field is required'
		errors.errField = 'email'
	} else if (!Validator.isEmail(data.email)) {
		errors.msg = 'Email is invalid'
		errors.errField = 'email'
	}

	// Password checks
	if (Validator.isEmpty(data.password)) {
		errors.msg = 'Password field is required'
		errors.errField = 'password'
	}
	if (Validator.isEmpty(data.password2)) {
		errors.msg = 'Confirm password field is required'
		errors.errField = 'password2'
	}
	if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.msg = 'Password must be at least 6 characters'
		errors.errField = 'password'
	}
	if (!Validator.equals(data.password, data.password2)) {
		errors.msg = 'Passwords must match'
		errors.errField = 'password2'
	}

	return {
		errors,
		isValid: isEmpty(errors)
	}
}

exports.validateLoginInput = function(data) {
	let errors = {}

	// Convert empty fields to an empty string so we can use validator functions
	data.email = !isEmpty(data.email) ? data.email : ''
	data.password = !isEmpty(data.password) ? data.password : ''

	// Email checks
	if (Validator.isEmpty(data.email)) {
		errors.email = 'Email field is required'
	} else if (!Validator.isEmail(data.email)) {
		errors.email = 'Email is invalid'
	}

	// Password checks
	if (Validator.isEmpty(data.password)) {
		errors.password = 'Password field is required'
	}

	return {
		errors,
		isValid: isEmpty(errors)
	}
}
