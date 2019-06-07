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

module.exports = router
