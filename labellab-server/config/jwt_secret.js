#!/usr/bin/env node
require("dotenv").config()

var jwt_secret = process.env.JWT_SECRET

if(!jwt_secret){
	jwt_secret = "JWTSECRET"
}

module.exports = {
	jwt_secret:jwt_secret
}