import Request from "../models/Request"
import Comment from "../models/Comment"
import Wallet from "../models/Wallet"
import payment from '../utils/stripe'
import User from "../models/User"

import notify from '../utils/notification'
import creds from '../config/stripe_key.json'


// this endpoint controller to handle session creation
// https://stripe.com/docs/payments/save-and-reuse?platform=android&ui=payment-sheet#add-server-endpoint 

// return the publishable key to be used in the frontend
const getPublishKey = async (req, res) => {
    try {
        res.send({
            status: true,
            message: "",
            data: creds.api_public
        })
    } catch (e) {
        let message = e.message
        res.send({
            status: false,
            message: message,
            data: ""
        })
    }
}

// create sesssion
// you can pass the payment_intent_data as manual to ensure "hold"
// this is equivilant to close_request
const createStripeSession = async (req, res) => {
    let statusCode
    try {

        const user = req.user
        const reqId = req.body.reqId
        const commentId = req.body.commentId

        const request = await Request.findById(reqId)

        // authorized ?
        if (!request.userId.equals(user._id)){
            statusCode = 403
            throw new Error("Can't perform this action !!!")
        }

        // check if the request doesn't have a mod
        if (request.mod){
            statusCode = 400
            throw new Error("Can't create a session : MOD already choosen !!!")
        }

        // get the accepted comment price
        const comment = await Comment.findById(commentId)

        if (!comment){
            statusCode = 404
            throw new Error("Comment not found !!!")
        }

        const modPrice = comment.price

        // saving the request and the mod both together as ref, so that I can reference them later on
        const requestModRef = `${reqId};${comment.userId};${commentId}`
        const session = await payment.createSession(user, modPrice, requestModRef)

        res.send({
            status: true,
            message: "Session has been created : Please hold the money to choose the MOD",
            data: session
        })
    } catch (e) {
        let message = e.message
        res.status(statusCode).send({
            status: false,
            message: message,
            data: ""
        })
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

                // update the mod
                await Request.findByIdAndUpdate(reqId, {
                    mod: modId,
                    state: "fulfilled",
                    paymentIntent: paymentIntent
                })

                // create a verification token and add it to the comment
                await Comment.findByIdAndUpdate(commentId, {
                    verify_secret : require('crypto').randomBytes(32).toString("hex")
                })

                // send a notification
                const choosenMod = await User.findById(modId)
                const notification_msg = {
                    "msg" : "Congratuation you're the choosen one :D"
                }
                if (choosenMod.notification_token)
                    notify.pushNotificationToOne(choosenMod.notification_token, notification_msg)

                break

            default:
                console.log(`Unhandled event type : ${event.type}`)
        }

        res.send({
            status: true,
            message: "Success, webhook is working :D",
            data: ""
        })

    } catch (e) {
        let message = e.message
        res.status(400).send({
            status: false,
            message: message,
            data: ""
        })
    }
}

// helper function to capture the payment and add amount to user's wallet
const capturePaymentHelper = async (request) => {

    // release the amount - fees
    const paymentSuccess = await payment.capturePayment(request.paymentIntent)

    // check if the user has wallet or not
    let userWallet = await Wallet.findOne({userId : request.mod})

    // create a wallet with the inital balance = first operation
    if (! userWallet){
        userWallet = new Wallet({
            userId: request.mod,
            balance: paymentSuccess.amount
        })
    }else {
        userWallet.balance = paymentSuccess.amount
    }

    // close the request
    request.state = "closed"

    await request.save()

    await userWallet.save()

}
// release the money to the MOD
// only the request maker can call this
// can only be called once, can't be undo
const releasePayment = async (req, res) => {
    let statusCode = 400
    try {

        const user = req.user
        const reqId = req.body.reqId
        const secretCode = req.body.verify_secret

        const request = await Request.findById(reqId)

        if (! request.userId.equals(user._id)){
            statusCode = 401
            throw new Error("Can't do this")
        }
        // request isn't closed
        if (request.state === "closed"){
            statusCode = 400
            throw new Error("Request already closed")
        }

        // the request maker nicely releases the money without scanning
        if (! secretCode){

            await capturePaymentHelper(request)
            // ToDo : notify the MOD
            // ...
            res.send({
                status: true,
                message: "Success : payment has been released !!!",
                data: "" 
            })
        
        }else {
            // verify the secret
            const correctSecretCode = await Comment.getVerifyToken(request.mod, request)

            if (secretCode !== correctSecretCode) {
                statusCode = 401
                throw new Error("Unauthorized to perform this")
            }

            await capturePaymentHelper(request)
            // ToDo : notify the MOD
            // ...
            res.send({
                status: true,
                message: "Success : payment has been released !!!",
                data: ""
            })
        }
   
    } catch (e) {
        let message = e.message
        res.status(statusCode).send({
            status: false,
            message: message,
            data: ""
        })
    }
}

export default {
    getPublishKey,
    createStripeSession,
    customWebhook,
    releasePayment
}