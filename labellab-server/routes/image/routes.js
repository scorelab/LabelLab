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
// To fetch a image
router.get("/:image_id/get", requireAuth, imageControls.fetchImageId)

// PUT method
// To update labelData details
router.put("/:image_id/update", requireAuth, imageControls.updateLabels)

// DELETE method
// To delete image
router.delete("/:project_id/delete/:image_id", requireAuth, imageControls.deleteImage)

module.exports = router
