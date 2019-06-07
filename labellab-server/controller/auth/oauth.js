#!/usr/bin/env node
require("dotenv").config()

const jwt = require("jwt-simple")
const secret = process.env.JWT_SECRET

function createtoken(user) {
	const timestamp = new Date().getTime()
	return jwt.encode({ sub: user.id, iat: timestamp }, secret)
}

module.exports.signin = function signin(req, res, next) {
	res.send({ token: createtoken(req.user) })
}
