var express = require("express")
var passport = require("passport")
const router = express.Router()
const requireAuth = passport.authenticate("jwt", { session: false })

// Include controllers of each route
const userControls = require("../../controller/user/userControls")

// GET method
// To fetch user information
router.get("/info", requireAuth, userControls.userInfo)

// GET method
// To fetch user information of a given user
router.get("/search/:query", requireAuth, userControls.searchUser)

// GET method
// To fetch user info count
router.get("/fetchCount", requireAuth, userControls.countInfo)

// POST method
// To upload user image
router.post("/uploadImage", requireAuth, userControls.userUploadImage)

module.exports = router
