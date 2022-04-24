import paymentService from "./payment.service"
import resp from "../../helpers/responseTemplate"
import success from "../../helpers/success"
import error from "../../helpers/error"
import payment from "../../utils/stripe"
import stripe from "../../utils/stripe"

const getPublishKey = async (req, res) => {

    const key = paymentService.getStripePubKey()

    try {
        res.send(resp(true, "" ,key))
    } catch (e) {
        res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}

const createStripeSession = async (req, res) => {
    try {

        const user = req.user
        const reqId = req.body.reqId
        const commentId = req.body.commentId

        if (! commentId || ! reqId)
            throw new error.ServerError(error.invalid.required("Request and Comment ID"))

        const session = await paymentService.createStripeSession(user, reqId, commentId)

        res.send(resp(true, success.payment.success, session))
    } catch (e) {
        res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}

// create a stripe account for MOD's to receive money
const createStripeAccount = async (req, res) => {
    try {

        const user = req.user

        // create a user pay
        // create an account user
        const account = await paymentService.createAccountUser(user)

        res.send(resp(true, success.payment.success, account))
    } catch (e) {
        res.status(400).send(resp(false, e.message, ""))
    }
}



// setup a webhook to listen for stripe events
// https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local
// https://stripe.com/docs/webhooks/best-practices
const customWebhook = async (req, res) => {
    try {

        let event = payment.createEvent(req.rawBody, req.headers['stripe-signature'])

        switch (event.type) {

            case 'checkout.session.completed' : 

                const paymentIntent = event.data.object.payment_intent

                // get the requestID and the commentID
                const [reqId, modId, commentId] = event.data.object.client_reference_id.split(";")

                await paymentService.closeRequestWH(reqId, modId, commentId, paymentIntent)

                break

            // user creates an account
            case 'account.updated':

                const accountId = event.data.object.id
                const userId = event.data.object.metadata._id

                await paymentService.updateStripeAccount(accountId, userId)

            default:
                console.log(`Unhandled event type : ${event.type}`)
        }

        res.send(resp(true, success.payment.webhook, ""))

    } catch (e) {
        console.log(e)
        res.status(400).send(resp(false, e.message, ""))
    }
}

// release the money to the MOD
// only the request maker can call this
// can only be called once, can't be undo
const releasePayment = async (req, res) => {
    try {

        const user = req.user
        const reqId = req.body.reqId
        const secretCode = req.body.verify_secret

        await paymentService.releasePayment(user, reqId, secretCode)

        res.send(resp(true, success.payment.released, ""))
   
    } catch (e) {
        res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}

export default {
    getPublishKey,
    createStripeSession,
    customWebhook,
    releasePayment,
    createStripeAccount
}