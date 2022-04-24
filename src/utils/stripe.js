/*
This util contains the payment functions :
    - save the user's credit card
        - attach the customer token to the User OR split it to another document in the db
    - holding the money
    - releasing
    - creating ...

*/
import creds from '../config/keys/stripe_key.json'
import Stripe from 'stripe';
const stripe = new Stripe(creds.api_secret);

// Save users cards' by creating a SetupIntent
// https://stripe.com/docs/payments/save-and-reuse?platform=android&ui=payment-sheet
// Save Card without payment...

// create session
// supports : 3D auth
const createSession = async (user, amountInEGP, refData, modAccount) => {
    try {

        // get it from the env var
        const appFee = 0.1

        if (! user?.customer_token) {

            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name
            })

            // Fix it : probably not a good idea to save before the session
            user.customer_token = customer.id

            await user.save()

        }
        const session = await stripe.checkout.sessions.create({
            customer: user.customer_token,
            payment_intent_data: {
                capture_method: "manual",
                setup_future_usage: "off_session",
                application_fee_amount: amountInEGP*100*appFee,
                transfer_data: {
                    destination: modAccount
                }
            },
            mode: "payment",
            line_items: [{
                price_data: {
                    currency: 'EGP',
                    product_data: {
                        name: 'Gimme'
                    },
                    unit_amount: amountInEGP*100,
                },
                quantity: 1,
            }],
            // used to ref for later
            client_reference_id: refData,
            payment_method_types: ["card"],
            success_url: `https://checkout.stripe.dev/success`,
            cancel_url: `https://checkout.stripe.dev/cancel`,
        })

        return session

    } catch (e) {
        // remove that customer from the db
        if (e.message.includes('No such customer')){

            user.customer_token = ""
            await user.save()
            
        }
        throw new Error(e.message) 
    }
}

const createEvent = (body, sig) => {
    let event

    try {
        event = stripe.webhooks.constructEvent(body, sig, creds.webhook_sec) 
    } catch (e) {
        throw new Error(e.message)
    }

    return event
}

// send the payment to the other side
const capturePayment = async (paymentIntentId) => {
    try {
        // transfer the paymentIntent to account
        const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId)

        return paymentIntent
    } catch (e) {
        throw new Error(e.message)
    }
}

/*
Why Express ?

Express enables your platform to manage payout schedules, 
customize the flow of funds, and control branding. Stripe will handle onboarding,
account management, and identity verification for your platform.

*/
const createExpressAccount = async (user) => {

    console.log(user)
    const account = stripe.accounts.create({
        type: "express",
        country: "EG",
        email: user.email,
        business_type: "individual",
        capabilities: {
            transfers: {requested: true},
        },
        tos_acceptance: {service_agreement: 'recipient'},
        metadata : {
            _id: user._id.toString(),
            email: user.email
        }
    })

    return account
}

const getAccountLink = async (accountId) => {

    const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: 'https://example.com/reauth',
        return_url: 'https://example.com/return',
        type: 'account_onboarding',
    })

    return accountLink
}
export default {
    createSession,
    createEvent,
    capturePayment,
    createExpressAccount,
    getAccountLink
}