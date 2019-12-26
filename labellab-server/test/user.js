var expect = require('chai').expect
var mongoose = require('mongoose')
let chai = require('chai')
let chaiHttp = require('chai-http')

var User = require('../models/user')
var Project = require('../models/project')
let server = require('../app')
let config = require('../config/test')
const Info = require('./info')

const projectInfo = {
		projectName: 'projectName'
	}
var token = ''
var createdUserId = ''

var query = 'gma'

const updateInfo = {
	name: 'updatedName',
    profileImage:'newProfileImage'
}

chai.use(chaiHttp)

describe('User tests', async () => {
	before(function(done) {
		mongoose
			.connect(config.mongoURI, {
				promiseLibrary: require('bluebird'),
				useNewUrlParser: true
			})
			.then(() => console.log('Test MongoDb connected successfully!'))
			.catch(err => console.error(err))
		const db = mongoose.connection
		db.on('error', console.error.bind(console, 'connection error'))
		db.once('open', function() {
			done()
		})
	})

	after(async () => {
		await Project.deleteOne({
				projectName: projectInfo.projectName
				}).exec(function(err) {
					if (err) {
						console.log(err)
					}
					process.exit(0)
					})
		await User.deleteOne({
			email: Info.userInfo.email
		}).exec(function(err) {
			if (err) {
				console.log(err)
			}
			process.exit(0)
		})
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
					createdUserId = data.body.body._id 
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
				done()
			}
		})
			})
   it('Search User', done => {
	chai
		.request(server)
		.get('/api/v1/users/search/' + query)
		.set('Authorization', 'Bearer ' + token)
		.send(Info.userInfo)
		.end((err, data) => {
			if (data) {
				expect(data).to.have.an('object')
				expect(data.body).to.have.property('success', true)
				expect(data.body).to.have.property('body')
				expect(data.body.body).to.have.an('array')
				done()
			}
		})
})
	it('Update User', done => {
		chai
			.request(server)
			.put('/api/v1/users/edit')
			.set('Authorization', 'Bearer ' + token)
			.send(updateInfo)
			.end((err, data) => {
				if (data) {
					expect(data).to.have.an('object')
					expect(data.body).to.have.property('success', true)
					expect(data.body).to.have.property('msg', 'User updated!')
					expect(data.body).to.have.property('body')
					expect(data.body.body).to.have.an('object')
					expect(data.body.body).to.have.property('name','updatedName')
					expect(data.body.body).to.have.property('profileImage','newProfileImage')
					done()
				}
			})
	})
	it('CountInfo of User', done => {
		chai
			.request(server)
			.get('/api/v1/users/fetchCount')
			.set('Authorization', 'Bearer ' + token)
			.send(Info.userInfo)
			.end((err, data) => {
				if (data) {
					expect(data).to.have.an('object')
					expect(data.body).to.have.property('success', true)
					expect(data.body).to.have.property('body')
					expect(data.body.body).to.have.an('object')
					expect(data.body.body).to.have.property('totalProjects')
					expect(data.body.body).to.have.property('totalImages')
					expect(data.body.body).to.have.property('totalLabels')
					done()
				}
			})
	})
	it('Image Uploads of User', done => {
		chai
			.request(server)
			.post('/api/v1/users/uploadImage')
			.set('Authorization', 'Bearer ' + token)
			.send(Info.imageInfo)
			.end((err, data) => {
				if (data) {
					expect(data).to.have.an('object')
					expect(data.body).to.have.property('success', true)
					expect(data.body).to.have.property('body')
					expect(data.body.body).to.have.an('string')
					expect(data.body).to.have.property('msg', 'Image Uploaded Successfully.')
					done()
				}
			})
	})
 })