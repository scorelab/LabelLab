var express = require("express")
var passport = require("passport")
const router = express.Router()
const requireAuth = passport.authenticate("jwt", { session: false })

// Include controllers of each route
const projectControls = require("../../controller/project/projectControls")

// POST method
// To initialize user project
router.post("/create", requireAuth, projectControls.initializeProject)

// GET method
// To fetch the project of the given id
router.get("/get/:id", requireAuth, projectControls.projectInfoId)

// GET method
// To fetch user project
router.get("/get", requireAuth, projectControls.projectInfo)

// PUT method
// To update user project
router.put("/update/:id", requireAuth, projectControls.updateProject)

// DELETE method
// To delete user project
router.delete("/delete/:id", requireAuth, projectControls.deleteProject)

// POST method
// To add member in project
router.post("/add/:project_id", requireAuth, projectControls.addMember)

// POST method
// To delete member in project
router.post("/remove/:project_id", requireAuth, projectControls.removeMember)

// POST method
// To upload project image
router.post("/:project_id/image", requireAuth, projectControls.projectUploadImage)

module.exports = router
