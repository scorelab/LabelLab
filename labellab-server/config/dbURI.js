#!/usr/bin/env node
require('dotenv').config()

var dbHost = process.env.DB_HOST || 'localhost'
var dbName = process.env.DB_NAME 
var dbCluster = process.env.DB_CLUSTER
var dbUser = process.env.DB_USERNAME
var dbPass = process.env.DB_PASSWORD
var dbPort = process.env.DB_PORT

let mongoURI

if(dbName && dbUser && dbPass){
	mongoURI = 'mongodb://'+ dbUser + ':' + dbPass + '@' + dbCluster + '/' + dbName
}
else if(dbName && !dbUser && !dbPass){
	mongoURI = 'mongodb://' + dbHost + ':' + dbPort + '/' + dbName
}
else{
	mongoURI = ''
}

module.exports = {
	mongoURI: mongoURI
}