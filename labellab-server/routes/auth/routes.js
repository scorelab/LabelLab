var express = require("express")
var passport = require("passport")
const router = express.Router()

// Controllers of each route
const OAuthlogin = require("../../controller/oauth").signin
const authController = require("../../controller/auth")
const requireLogin = passport.authenticate("local", { session: false })

require("../../config/google_passport")

// Routes corresponding to the controllers
router.post("/register", authController.userRegister)

router.post("/login", requireLogin, authController.userLogin)
router.get(
	"/google",
	passport.authenticate("google", {
		session: false,
		scope: ["profile", "email"]
	})
)

router.get(
	"/google/callback",
	passport.authenticate("google", { session: false }),
	(req, res, next) => {
		OAuthlogin(req, res, next)
	}
)

module.exports = router
