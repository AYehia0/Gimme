const router = require('express').Router()
const auth = require('../middlewares/auth')

// the controller
const paymentCont = require('../controller/user.payment')

// retrive stripe's publishable key to be used in the frontend
router.get("/config", auth.userAuth, paymentCont.getPublishKey)

// exporting
module.exports = router