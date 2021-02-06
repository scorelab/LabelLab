var expect = require('chai').expect
var mongoose = require('mongoose')
let chai = require('chai')
let chaiHttp = require('chai-http')
var fs = require('fs')

var Classification = require('../models/classification')
var Image = require('../models/image')
var User = require('../models/user')
var Project = require('../models/project')
let server = require('../app')
let conn = require('../config/test')
const Info = require('./info')

const projectInfo = {
		projectName: 'projectName1'
	}
var token = ''
var createdUserId = ''
var classificationId = ''
var imageUrl=''
chai.use(chaiHttp)

describe('Classification tests', async () => {
	before(function(done) {
		conn.connect()
		.then(() => done())
		.catch((err) => done(err));
	})
	after(async () => {
		await conn.close()
		process.exit(0)
	})

	it('User Register', done => {
		chai
			.request(server)
			.post('/api/v1/auth/register')
			.send(Info.userInfo)
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
				email: Info.userInfo.email,
				password: Info.userInfo.password
			})
			.end((err, data) => {
				if (data.body) {
					expect(data.body).to.be.an('object')
					expect(data.body).to.have.property('msg')
					expect(data.body).to.have.property('success', true)
					expect(data.body).to.have.property('token')
					token = data.body.token
					done()
				}
			})
	})

	it('Get User', done => {
		chai
			.request(server)
			.get('/api/v1/users/info')
			.set('Authorization', 'Bearer ' + token)
			.send()
			.end((err, data) => {
				if (data) {
					expect(data).to.have.an('object')
					expect(data.body).to.have.property('success', true)
					expect(data.body).to.have.property('msg','User Data Found')
					expect(data.body).to.have.property('body')
					expect(data.body.body).to.have.property('username')
					expect(data.body.body).to.have.property('_id')
					expect(data.body.body).to.have.property('profileImage')
					expect(data.body.body).to.have.property('name')
					expect(data.body.body).to.have.property('email')
					expect(data.body.body).to.have.property('thumbnail')
					createdUserId = data.body._id 
					done()
				}
			})
	})
	it('Create Classification', done => {
	chai
		.request(server)
		.post('/api/v1/classification/classify')
		.set('Authorization', 'Bearer ' + token)
		.send(Info.imageInfo)
		.end((err, data) => {
			if (data) {
				expect(data).to.have.an('object')
				expect(data.body).to.have.property('success', true)
				expect(data.body).to.have.property('msg', 'Image Successfully Classified')
				expect(data.body).to.have.property('body')
				expect(data.body.body).to.have.property('_id')
                expect(data.body.body).to.have.property('imageUrl')
                expect(data.body.body).to.have.property('user')
                expect(data.body.body).to.have.property('label')
                expect(data.body.body.label).to.have.an('Array')
                classificationId = data.body.body._id 
                console.log(classificationId)
                imageUrl = data.body.body.imageUrl
                done()
			}
		})
    })
    it('Get Classifications', done => {
        chai
            .request(server)
            .get('/api/v1/classification/get')
            .set('Authorization', 'Bearer ' + token)
            .send()
            .end((err, data) => {
                if (data) {
                    expect(data).to.have.an('object')
                    expect(data.body).to.have.property('success', true)
                    expect(data.body).to.have.property('msg', 'Classification data Found')
                    expect(data.body).to.have.property('body')
                    expect(data.body.body).to.have.an('Array')
                    done()
                }
            })
                })
                it('Get A Classification', done => {
                    chai
                        .request(server)
                        .get('/api/v1/classification/get/'+classificationId)
                        .set('Authorization', 'Bearer ' + token)
                        .send()
                        .end((err, data) => {
                            if (data) {
                                expect(data).to.have.an('object')
                                expect(data.body).to.have.property('success', true)
                                expect(data.body).to.have.property('msg', 'Classification Data Found')
                                expect(data.body).to.have.property('body')
                                expect(data.body.body).to.have.an('Array')
                                done()
                            }
                        })
                })
                it('Classification Delete', done => {
                    		chai
                    			.request(server)
                    			.delete('/api/v1/classification/delete/' + classificationId)
                    			.set('Authorization', 'Bearer ' + token)
                    			.send()
                    			.end((err, data) => {
                    				if (data) {
                    					expect(data).to.have.an('object')
                    					expect(data.body).to.have.property('success', true)
                    					expect(data.body).to.have.property('msg', 'Classification deleted')
                    					done()
                    				}
                    			})
                    	})
 })
 
 