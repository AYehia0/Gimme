const router = require('express').Router()
const auth = require('../middlewares/auth.js')

// the controller
const reviewCont = require('../controller/userRevController.js')

// write a review
router.post('/give', auth.userAuth, reviewCont.giveReview)

// exporting
module.exports = router

