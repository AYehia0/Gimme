const Request = require("../models/Request")
const Comment = require("../models/Comment")
const payment = require("../utils/stripe")
const creds = require("../config/stripe_key.json")


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
        const requestModRef = reqId + ";" + comment.userId

        const session = await payment.createSession(user, modPrice, requestModRef)

        res.send({
            status: true,
            message: "Session has been created !!!",
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

        let event = payment.createEvent(req.rawBody, req.headers['stripe-signature'],)

        switch (event.type) {

            case 'checkout.session.completed' : 
                // get the requestID and the commentID

                try {
                    const [reqId, modId] = event.data.object.client_reference_id.split(";")

                    // update the mod
                    await Request.findByIdAndUpdate(reqId, {
                        mod: modId,
                        state: "fulfilled"
                    })
                    
                } catch (e) {
                    console.log(e.message)
                }
                // send a notification
                // ...
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
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

module.exports =  {
    getPublishKey,
    createStripeSession,
    customWebhook,
}