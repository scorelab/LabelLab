var express = require("express")
var passport = require("passport")
const router = express.Router()
const requireAuth = passport.authenticate("jwt", { session: false })

// Include controllers of each route
const imageControls = require("../../controller/image/imageControls")

// POST method
// To post image of a project
router.post("/:project_id/create", requireAuth, imageControls.postImage)

// GET method
// To fetch all images of a project
router.get("/:project_id/fetch", requireAuth, imageControls.fetchImage)

// GET method
// To fetch a image
router.get("/:image_id", requireAuth, imageControls.fetchImageId)

module.exports = router
