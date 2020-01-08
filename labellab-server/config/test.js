#!/usr/bin/env node
const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
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
	mongoURI = 'mongodb+srv://adi:adi9891255973@adi-ocz5j.mongodb.net/test?retryWrites=true&w=majority'
} else {
	mongoURI = ''
}

function connect() {
  return new Promise((resolve, reject) => {
      mockgoose.prepareStorage()
        .then(() => {
          mongoose.connect(mongoURI,
            { useNewUrlParser: true, useCreateIndex: true })
            .then((res, err) => {
              if (err) return reject(err);
              resolve();
            })
     })
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };