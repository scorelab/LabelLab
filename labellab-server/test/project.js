var expect = require("chai").expect
var mongoose = require("mongoose")
let chai = require("chai")
let chaiHttp = require("chai-http")

var Project = require("../models/project")
var User = require("../models/user")
let server = require("../app")
let config = require("../config/travis")

const userInfo = {
	name: "name",
	username: "username",
	email: "email@gmail.com",
	password: "password",
	password2: "password"
}

var token = ""
var createdProjectId = ""

const info = {
	projectName: "projectName"
}

const updateInfo = {
	projectName: "projectNameUpdate"
}

chai.use(chaiHttp)

describe("Project tests", async () => {
	before(function(done) {
		mongoose
			.connect(config.mongoURI, {
				promiseLibrary: require("bluebird"),
				useNewUrlParser: true
			})
			.then(() => console.log("Test MongoDb connected successfully!"))
			.catch(err => console.error(err))
		const db = mongoose.connection
		db.on("error", console.error.bind(console, "connection error"))
		db.once("open", function() {
			done()
		})
	})

	after(async () => {
		await Project.deleteOne({
			projectName: info.projectName
		}).exec(function(err) {
			if (err) {
				console.log(err)
			}
			process.exit(0)
		})
		await User.deleteOne({
			email: userInfo.email
		}).exec(function(err) {
			if (err) {
				console.log(err)
			}
			process.exit(0)
		})
	})

	it("User Register", done => {
		chai
			.request(server)
			.post("/api/v1/auth/register")
			.send(userInfo)
			.end((err, data) => {
				if (data) {
					expect(data).to.have.an("object")
					expect(data).to.not.have.property("password2", "Passwords must match")
					expect(data).to.not.have.property("msg", "Email not found")
					expect(data).to.not.have.property("msg", "Email already exists")
					done()
				}
			})
	})

	it("User Login", done => {
		chai
			.request(server)
			.post("/api/v1/auth/login")
			.send({
				email: userInfo.email,
				password: userInfo.password
			})
			.end((err, data) => {
				if (data.body) {
					expect(data.body).to.be.an("object")
					expect(data.body).to.have.property("msg")
					expect(data.body).to.have.property("success", true)
					expect(data.body).to.have.property("token")
					token = data.body.token
					done()
				}
			})
	})

	it("Project Create", done => {
		chai
			.request(server)
			.post("/api/v1/project/create")
			.set("Authorization", "Bearer " + token)
			.send(info)
			.end((err, data) => {
				if (data) {
					expect(data).to.have.an("object")
					expect(data.body).to.have.property("success", true)
					expect(data.body).to.have.property("msg", "Project Successfully Posted")
					expect(data.body).to.have.property("body")
					expect(data.body.body).to.have.property("_id")
					expect(data.body).to.not.have.property("msg", "Project name already exists")
					createdProjectId = data.body.body._id 
					done()
				}
			})
	})

	it("Project Create Duplicate", done => {
		chai
			.request(server)
			.post("/api/v1/project/create")
			.set("Authorization", "Bearer " + token)
			.send(info)
			.end((err, data) => {
				if (data) {
					expect(data).to.have.an("object")
					expect(data.body).to.have.property("msg", "Project name already exists")
					done()
				}
			})
	})

	it("Project Get", done => {
		chai
			.request(server)
			.get("/api/v1/project/get")
			.set("Authorization", "Bearer " + token)
			.send(info)
			.end((err, data) => {
				if (data) {
					expect(data).to.have.an("object")
					expect(data.body).to.have.property("success", true)
					expect(data.body).to.have.property("msg")
					expect(data.body).to.have.property("body")
					expect(data.body.body).to.have.an("array")
					done()
				}
			})
	})

	it("Project Get By Id", done => {
		chai
			.request(server)
			.get("/api/v1/project/get/" + createdProjectId)
			.set("Authorization", "Bearer " + token)
			.send(info)
			.end((err, data) => {
				if (data) {
					expect(data).to.have.an("object")
					expect(data.body).to.have.property("success", true)
					expect(data.body).to.have.property("msg")
					expect(data.body).to.have.property("body")
					expect(data.body.body).to.have.an("object")
					done()
				}
			})
	})

	it("Project Update", done => {
		chai
			.request(server)
			.put("/api/v1/project/update/" + createdProjectId)
			.set("Authorization", "Bearer " + token)
			.send(updateInfo)
			.end((err, data) => {
				if (data) {
					expect(data).to.have.an("object")
					expect(data.body).to.have.property("success", true)
					expect(data.body).to.have.property("msg", "Project updated successfully!")
					expect(data.body).to.have.property("body")
					expect(data.body.body).to.have.an("object")
					expect(data.body.body).to.have.property("projectName", updateInfo.projectName)
					done()
				}
			})
	})

	it("Project Delete", done => {
		chai
			.request(server)
			.delete("/api/v1/project/delete/" + createdProjectId)
			.set("Authorization", "Bearer " + token)
			.send()
			.end((err, data) => {
				if (data) {
					expect(data).to.have.an("object")
					expect(data.body).to.have.property("success", true)
					expect(data.body).to.have.property("msg", "Project deleted successfully!")
					done()
				}
			})
	})

})
