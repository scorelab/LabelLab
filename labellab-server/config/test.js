#!/usr/bin/env node
require('dotenv').config()

var travis = process.env.TRAVIS
var dbHost = process.env.DB_HOST || 'localhost'
var dbName = process.env.DB_NAME
var dbCluster = process.env.DB_CLUSTER
var dbUser = process.env.DB_USERNAME
var dbPass = process.env.DB_PASSWORD

let mongoURI

if (travis) {
	mongoURI = 'mongodb://travis:test@localhost:27017/mydb_test'
} else if (dbHost && dbName && dbCluster && dbUser && dbPass) {
	mongoURI = '' + dbHost + '://' + dbUser + ':' + dbPass + '@' + dbCluster + '/' + dbName
} else {
	mongoURI = ''
}

module.exports = {
	mongoURI: mongoURI
}