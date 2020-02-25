var expect = require('chai').expect
var mongoose = require('mongoose')
let chai = require('chai')
let chaiHttp = require('chai-http')

var Project = require('../models/project')
var User = require('../models/user')
var Label = require('../models/label')
let server = require('../app')
let conn = require('../config/test')
const Info = require('./info')

const userInfo = {
	name: 'name',
	username: 'username',
	email: 'email@gmail.com',
	password: 'password',
	password2: 'password'
}

var token = ''
var createdProjectId = ''
var createdLabelId = ''

const projectInfo = {
    projectName: 'projectName'
}

const info = {
    label: 'labelName',
    type: 'String'
}

chai.use(chaiHttp)

describe('Label tests', async () => {
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
			.send(userInfo)
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
				email: userInfo.email,
				password: userInfo.password
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

	it('Project Create', done => {
		chai
			.request(server)
			.post('/api/v1/project/create')
			.set('Authorization', 'Bearer ' + token)
			.send(projectInfo)
			.end((err, data) => {
				if (data) {
					expect(data).to.have.an('object')
					expect(data.body).to.have.property('success', true)
					expect(data.body).to.have.property('msg', 'Project Successfully Posted')
					expect(data.body).to.have.property('body')
					expect(data.body.body).to.have.property('_id')
					expect(data.body).to.not.have.property('msg', 'Project name already exists')
					createdProjectId = data.body.body._id 
					done()
				}
			})
    })
    
    it('Label Create', done => {
		chai
			.request(server)
			.post('/api/v1/label/' + createdProjectId + '/create')
			.set('Authorization', 'Bearer ' + token)
			.send(info)
			.end((err, data) => {
				if (data) {
					expect(data).to.have.an('object')
					expect(data.body).to.have.property('success', true)
					expect(data.body).to.have.property('msg')
					expect(data.body).to.have.property('body')
                    expect(data.body).to.not.have.property('msg', 'Cannot Append Member')
                    createdLabelId = data.body.body._id 
					done()
				}
			})
	})

	it('Fetch time-label dataset of a project', done => {
		chai
			.request(server)
			.get('/api/v1/analytics/' + createdProjectId + '/timeLabel/get')
			.set('Authorization', 'Bearer ' + token)
			.end((err, data) => {
				if (data) {
					expect(data).to.have.an('object')
                    expect(data.body).to.have.property('success', true)
                    expect(data.body).to.have.property('body')
                    expect(data.body.body).to.have.an('object')
                    expect(data.body.body.labels).to.have.an('array')
					done()
				}
			})
    })
    
    it('Fetch counts of how often a label is used in a project', done => {
		chai
			.request(server)
			.get('/api/v1/analytics/' + createdProjectId + '/labelCount/get')
			.set('Authorization', 'Bearer ' + token)
			.end((err, data) => {
				if (data) {
					expect(data).to.have.an('object')
                    expect(data.body).to.have.property('success', true)
                    expect(data.body).to.have.property('body')
                    expect(data.body.body).to.have.an('object')
                    expect(data.body.body.labels).to.have.an('array')
					done()
				}
			})
    })
    
	it('Label Delete', done => {
		chai
			.request(server)
			.delete('/api/v1/label/' + createdLabelId + '/delete')
			.set('Authorization', 'Bearer ' + token)
			.send()
			.end((err, data) => {
				if (data) {
					expect(data).to.have.an('object')
					expect(data.body).to.have.property('success', true)
					expect(data.body).to.have.property('msg', 'Removed successfully!')
					done()
				}
			})
    })

})
