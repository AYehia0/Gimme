import Request from "../../models/Request"
import Comment from "../../models/Comment"
import Wallet from "../../models/Wallet"
import User from "../../models/User"

import notify from "../../utils/notification"
import payment from "../../utils/stripe"

import creds from "../../config/keys/stripe_key.json" assert {type: "json"}
import error from "../../helpers/error"

import crypto from "crypto"

import globalValidation from '../../helpers/validation'

// this endpoint controller to handle session creation
// https://stripe.com/docs/payments/save-and-reuse?platform=android&ui=payment-sheet#add-server-endpoint 

// return the publishable key to be used in the frontend
const getStripePubKey = () => {

    return creds.api_public

}

// create sesssion
// you can pass the payment_intent_data as manual to ensure "hold"
// this is equivilant to close_request
const createStripeSession = async (user, reqId, commentID) => {

    const requestId = globalValidation.validateId(reqId, "reqId")
    const commentId = globalValidation.validateId(commentID, "commentId")

    const request = await Request.findById(requestId)

    if (!request)
        throw new error.ServerError(error.request.notfound, 404)

    // authorized ?
    if (!request.userId.equals(user._id))
        throw new error.ServerError(error.user.auth, 403)

    // check if the request doesn't have a mod
    if (request.mod)
        throw new error.ServerError(error.request.modChoosen, 405)

    // get the accepted comment price
    const comment = await Comment.findById(commentId)

    if (!comment)
        throw new error.ServerError(error.comment.notfound, 404)

    const modPrice = comment.price

    // saving the request and the mod both together as ref, so that I can reference them later on
    const requestModRef = `${requestId};${comment.userId};${commentId}`

    const mod = await User.findById(comment.userId.toString())

    if (!mod.account_id)
        throw new error.ServerError(error.user.noAccount, 409)

    const session = await payment.createSession(user, modPrice, requestModRef, mod.account_id)

    return session

}

// create an account
const createAccountUser = async (user) => {

    let accountId = ""

    if (!user.account_id) {

        accountId = (await payment.createExpressAccount(user)).id

        const accountLink = await payment.getAccountLink(accountId)

        return accountLink
    }

    // if the user does have a stripe account
    throw new error.ServerError(error.user.hasAccount, 409)
    
}

// custom webshook for stripe events 
// this function is only used for webhooks, assuming stripe's webhook is secure
const closeRequestWH = async (requestId, modId, commentId, paymentIntent) => {

    // update the mod
    await Request.findByIdAndUpdate(requestId, {
        mod: modId,
        state: "fulfilled",
        paymentIntent: paymentIntent
    })

    // create a verification token and add it to the comment
    await Comment.findByIdAndUpdate(commentId, {
        // ToDo : change this to import 
        verify_secret : crypto.randomBytes(32).toString("hex")
    })

    // send a notification
    const choosenMod = await User.findById(modId)

    const notification_msg = {
        "msg" : "Congratuation you're the choosen one :D"
    }

    // send a notification with the new notification Model

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
        userWallet.balance += paymentSuccess.amount
    }

    // close the request
    request.state = "closed"

    await request.save()

    await userWallet.save()

}

// add the money to the other account
const releasePayment = async (user, requestId, secret) => {

    const request = await Request.findById(requestId)

    if (! request)
        throw new error.ServerError(error.request.notfound, 404)

    if (! request.userId.equals(user._id))
        throw new error.ServerError(error.user.auth, 401)

    // request isn't closed
    if (request.state === "closed")
        throw new error.ServerError(error.request.closed, 405)

    // the request maker nicely releases the money without scanning
    if (! secret){

        return await capturePaymentHelper(request)
    
    }else {
        // verify the secret
        const correctSecretCode = await Comment.getVerifyToken(request.mod, request)

        if (secret !== correctSecretCode) 
            throw new error.ServerError(error.user.auth, 401)

        await capturePaymentHelper(request)

    }

}

// update the db with the new stripe account
// this can't fail
const updateStripeAccount = async (accountId, userId) => {

    // only for testing
    if (! accountId || ! userId)
        throw new error.ServerError("What the heck is going on here ?", 500)

    // find the user and update
    await User.findOneAndUpdate({_id : userId}, {
        account_id : accountId
    })

}

export default {
    getStripePubKey,
    createStripeSession,
    closeRequestWH,
    releasePayment,
    createAccountUser,
    updateStripeAccount
}