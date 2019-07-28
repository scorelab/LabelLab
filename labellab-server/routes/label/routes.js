var express = require("express")
var passport = require("passport")
const router = express.Router()
const requireAuth = passport.authenticate("jwt", { session: false })

// Include controllers of each route
const labelControls = require("../../controller/label/labelControls")

// POST method
// To post label of a project
router.post("/:projectId/create", requireAuth, labelControls.createLabel)

// PUT method
// To update label of a project
router.put("/:labelId/update", requireAuth, labelControls.updateLabel)

// GET method
// To fetch labels of a project
router.get("/:projectId/get", requireAuth, labelControls.fetchLabel)

// DELETE method
// To delete labels of a project
router.delete("/:labelId/delete", requireAuth, labelControls.deleteLabel)

module.exports = router
