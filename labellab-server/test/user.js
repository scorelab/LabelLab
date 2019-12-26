var expect = require('chai').expect
var mongoose = require('mongoose')
let chai = require('chai')
let chaiHttp = require('chai-http')

var User = require('../models/user')
var Project = require('../models/project')
let server = require('../app')
let config = require('../config/test')
const Info = require('./info')
// const Info.userInfo = {
// 	name: 'name',
// 	username: 'username',
// 	email: 'gmail@gmail.com',
// 	password: 'password',
// 	password2: 'password',
// 	thumbnail:'thumbnail',
// 	googleId:'googleId',
// 	githubId:'githubId',
//     profileImage:'profileImage'
// }

const projectInfo = {
		projectName: 'projectName'
	}
var token = ''
var createdUserId = ''
// const Info.imageInfo ={ 
// 	format:'image/png',
// 	image:'data:image/png;base64,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'
// }
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