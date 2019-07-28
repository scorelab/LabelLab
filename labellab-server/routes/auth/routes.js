var express = require("express")
var passport = require("passport")
const router = express.Router()

// Controllers of each route
const OAuthlogin = require("../../controller/auth/oauth").signin
const authController = require("../../controller/auth/auth")
const requireLogin = passport.authenticate("local", { session: false })

require("../../config/githubPassport")

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

router.post(
	"/google/mobile",
	authController.googleUserCreate,
	(req, res, next) => {
		OAuthlogin(req, res, next)
	}
)

router.get("/github", passport.authenticate("github"))

router.get(
	"/github/callback",
	passport.authenticate("github", { session: false }),
	(req, res, next) => {
		OAuthlogin(req, res, next)
	}
)

module.exports = router
