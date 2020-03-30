var express = require('express')
var passport = require('passport')
const router = express.Router()
const requireAuth = passport.authenticate('jwt', { session: false })

// Include controllers of each route
const detectionControls = require('../../controller/detection/detectionControls')

// POST method
// To process a new detection
router.post('/detect', requireAuth, detectionControls.detect)

// GET method
// To fetch all detections of the user
router.get('/get', requireAuth, detectionControls.fetchDetection)

// GET method
// To fetch a detection
router.get('/get/:detectionId', requireAuth, detectionControls.fetchDetectionId)

// DELETE method
// To delete a detection
router.delete('/delete/:detectionId', requireAuth, detectionControls.deleteDetectionId)

module.exports = router