import paymentCont from './payment.controller'
import { Router } from 'express'
import auth from '../../middlewares/auth'

let router = Router()

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
export default router