var express = require("express")
var passport = require("passport")
const router = express.Router()
const requireAuth = passport.authenticate("jwt", { session: false })

// Include controllers of each route
const classificationControls = require("../../controller/classification/classificationControls")

// POST method
// To process a new classification
router.post("/classify", requireAuth, classificationControls.classify)

// GET method
// To fetch all classification of the user
router.get("/get", requireAuth, classificationControls.fetchClassification)

// GET method
// To fetch a classification
router.get("/get/:classificationId", requireAuth, classificationControls.fetchClassificationId)

// DELETE method
// To delete a classification
router.delete("/delete/:classificationId", requireAuth, classificationControls.deleteClassificationId)

module.exports = router
