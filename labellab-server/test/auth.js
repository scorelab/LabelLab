var expect = require('chai').expect
var mongoose = require('mongoose')
let chai = require('chai')
let chaiHttp = require('chai-http')

var User = require('../models/user')
let server = require('../app')
let conn = require('../config/test')

const info = {
	name: 'name',
	username: 'username',
	email: 'email@gmail.com',
	password: 'password',
	password2: 'password'
}

chai.use(chaiHttp)

describe('Authentication tests', async () => {
	before(function(done) {
		conn.connect()
		.then(() => done())
		.catch((err) => done(err));
	})

	after((done) => {
		conn.close()
		.then(() => done())
		.catch((err) => done(err));
	})
	it('User Register', done => {
		chai
			.request(server)
			.post('/api/v1/auth/register')
			.send(info)
			.end((err, data) => {
				if (data) {
					expect(data).to.have.an('object')
					expect(data).to.not.have.property('password2', 'Passwords must match')
					expect(data).to.not.have.property('msg', 'Email not found')
					expect(data).to.not.have.property('msg', 'Email already exists')
					done()
				}
			})
	})

	it('User Login', done => {
		chai
			.request(server)
			.post('/api/v1/auth/login')
			.send({
				email: info.email,
				password: info.password
			})
			.end((err, data) => {
				if (data.body) {
					expect(data.body).to.be.an('object')
					expect(data.body).to.have.property('msg')
					expect(data.body).to.have.property('success', true)
					expect(data.body).to.have.property('token')
					done()
				}
			})
	})
})
