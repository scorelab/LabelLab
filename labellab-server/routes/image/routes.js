var express = require("express")
var passport = require("passport")
const router = express.Router()
const requireAuth = passport.authenticate("jwt", { session: false })

// Include controllers of each route
const imageControls = require("../../controller/image/imageControls")

// POST method
// To post image of a project
router.post("/:projectId/create", requireAuth, imageControls.postImage)

// GET method
// To fetch a image
router.get("/:imageId/get", requireAuth, imageControls.fetchImageId)

// PUT method
// To update labelData details
router.put("/:imageId/update", requireAuth, imageControls.updateLabels)

// DELETE method
// To delete image
router.delete("/:projectId/delete/:imageId", requireAuth, imageControls.deleteImage)

module.exports = router
