var express = require("express")
var passport = require("passport")
const router = express.Router()
const requireAuth = passport.authenticate("jwt", { session: false })

// Include controllers of each route
const labelControls = require("../../controller/label/labelControls")

// POST method
// To post image of a project
router.post("/:image_id/create", requireAuth, labelControls.postLabel)

module.exports = router
