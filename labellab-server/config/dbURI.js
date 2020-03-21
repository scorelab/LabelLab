#!/usr/bin/env node
require('dotenv').config()

var dbHost = process.env.DB_HOST || 'localhost'
var dbName = process.env.DB_NAME
var dbCluster = process.env.DB_CLUSTER
var dbUser = process.env.DB_USERNAME
var dbPass = process.env.DB_PASSWORD

let mongoURI

if(dbName && dbUser && dbPass){
	mongoURI = 'mongodb+srv://IndrajithEkanayaka:labellab&971010@labellab-wikwc.mongodb.net/test?retryWrites=true&w=majority'
}
else{
	mongoURI = ''
}

module.exports = {
	mongoURI: mongoURI
}