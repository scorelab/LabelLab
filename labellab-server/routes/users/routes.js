var express = require("express")
var passport = require("passport")
const router = express.Router()
const requireAuth = passport.authenticate("jwt", { session: false })

// Include controllers of each route
const userControls = require("../../controller/user/userControls")

// GET method
// To fetch user information
router.get("/info", requireAuth, userControls.userInfo)

module.exports = router
