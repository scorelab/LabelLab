#!/usr/bin/env node
require('dotenv').config()

var jwtSecret = process.env.JWT_SECRET

if(!jwtSecret){
	jwtSecret = 'JWTSECRET'
}

module.exports = {
	jwtSecret:jwtSecret
}