var express = require("express")
var passport = require("passport")
const router = express.Router()
const requireAuth = passport.authenticate("jwt", { session: false })

// Include controllers of each route

router.get("/profile", requireAuth, function(req, res) {
	// res.render("profile.ejs", {
	// 	user: req.user // get the user out of session and pass to template
	// })
})

module.exports = router
