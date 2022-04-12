const bodyParser = require("body-parser")
const router = require('express').Router()
//.use(bodyParser.raw({type: '*/*'}))
const express = require("express")
const auth = require('../middlewares/auth')

// the controller
const paymentCont = require('../controller/user.payment')

// retrive stripe's publishable key to be used in the frontend
router.get("/config", auth.userAuth, paymentCont.getPublishKey)

// create a session
router.post("/create-stripe-session", auth.userAuth,  paymentCont.createStripeSession)

// release the money
// easy mode : request maker does it without scanning any QR code.
// hard mode : request maker scans the MOD's QR code.
router.post("/release-payment", auth.userAuth,  paymentCont.releasePayment)

// express.raw({type: 'application/json'})
router.post("/webhook", paymentCont.customWebhook)

// exporting
module.exports = router