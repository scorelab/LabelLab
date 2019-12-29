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
	mongoURI = '' + dbHost + '://' + dbUser + ':' + dbPass + '@' + dbCluster + '/' + dbName
}
 else {
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

async function close() {
  mongoose.connections.forEach(async (con) => {
    await con.close();
  })
  await mockgoose.mongodHelper.mongoBin.childProcess.kill();
  await mockgoose.helper.reset();
  await mongoose.disconnect();
}

module.exports = { connect, close };
