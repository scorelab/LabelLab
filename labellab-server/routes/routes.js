var express = require("express")
var router = express.Router()

// API's path
var authRoute = require("./auth/routes")
// var usersRoute = require("./users/routes")

// Routes
// -> /api/auth/
router.use("/api/v1/auth", authRoute)
// router.use("/api/users", usersRoute)

module.exports = router
