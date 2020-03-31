var express = require('express')
var passport = require('passport')
const router = express.Router()
const requireAuth = passport.authenticate('jwt', { session: false })

// Include controllers of each route
const objectDetectionControls = require('../../controller/objectdetection/objectDetectionControls')

// POST method
// To process a new object detection
router.post('/detect', requireAuth, objectDetectionControls.detect)

// GET method
// To fetch all object detections of the user
router.get('/get', requireAuth, objectDetectionControls.fetchDetections)

// GET method
// To fetch a detection
router.get('/get/:detectionId', requireAuth, objectDetectionControls.fetchDetectionId)

// DELETE method
// To delete a detection
router.delete('/delete/:detectionId', requireAuth, objectDetectionControls.deleteDetectionId)

module.exports = router