#!/usr/bin/env node
require("dotenv").config()

var createError = require("http-errors")
var express = require("express")
var cookieParser = require("cookie-parser")
var mongoose = require("mongoose")
var logger = require("morgan")
let passport = require("passport")
let cors = require("cors")
let path = require("path")

var indexRouter = require("./routes/routes")
let config = require("./config/dbURI")

var app = express()

if (process.env.GOOGLE_CLIENT_ID) {
	const passportGoogle = require("./config/googlePassport")
}

if (process.env.GITHUB_CLIENT_ID) {
	const passportGithub = require("./config/githubPassport")
}

app.use(logger("dev"))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false, limit: "4mb" }))
app.use(cookieParser())
app.set("/views", path.join(__dirname, "views"))
app.engine("html", require("ejs").renderFile)
app.set("view engine", "html")

app.use("/static", express.static(path.join(__dirname, "public")))

// Passport Config
require("./config/passport").passport
app.use(passport.initialize())
app.use(passport.session())
app.use("/", indexRouter)
// Connect to MongoDB
mongoose
	.connect(config.mongoURI, {
		promiseLibrary: require("bluebird"),
		useNewUrlParser: true
	})
	.then(() => console.log("MongoDB connected successfully!"))
	.catch(err => console.error(err))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get("env") === "development" ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render("error")
})

module.exports = app
