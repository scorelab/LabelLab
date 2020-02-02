var express = require('express')
var passport = require('passport')
const router = express.Router()
const requireAuth = passport.authenticate('jwt', { session: false })

// Include controllers of each route
const analyticsControls = require('../../controller/analytics/analyticsControls')

// GET method
// To fetch time-label dataset of a project
router.get(
  '/:projectId/timeLabel/get',
  requireAuth,
  analyticsControls.timeLabel
)

// GET method
// To fetch counts of how often a label is used in a project
router.get(
  '/:projectId/labelCount/get',
  requireAuth,
  analyticsControls.countLabel
)

module.exports = router
