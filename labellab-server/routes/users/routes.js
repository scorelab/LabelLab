var express = require("express")
var passport = require("passport")
const router = express.Router()
const requireAuth = passport.authenticate("jwt", { session: false })

// Include controllers of each route
const userControls = require("../../controller/user/userControls")

// GET method
// To fetch user information
router.get("/info", requireAuth, userControls.userInfo)

// POST method
// To initialize user project
router.post("/create/project", requireAuth, userControls.initializeProject)

// GET method
// To fetch the project of the given id
router.get("/get/project/:id", requireAuth, userControls.projectInfoId)

// GET method
// To fetch user project
router.get("/get/project", requireAuth, userControls.projectInfo)

// PUT method
// To update user project
router.put("/update/project/:id", requireAuth, userControls.updateProject)

module.exports = router
