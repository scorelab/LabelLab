var express = require("express")
var passport = require("passport")
const router = express.Router()

// Controllers of each route
const authController = require("../../controller/auth")
const requireLogin = passport.authenticate("local", { session: false })

// Routes corresponding to the controllers
router.post("/register", authController.userRegister)

router.post("/login", requireLogin, authController.userLogin)
router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["/login"]
	})
)
router.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/login" }),
	function(req, res) {
		console.log(req, res)
		res.redirect("/")
	}
)

module.exports = router
