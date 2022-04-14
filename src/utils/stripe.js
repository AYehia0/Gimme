/*
This util contains the payment functions :
    - save the user's credit card
        - attach the customer token to the User OR split it to another document in the db
    - holding the money
    - releasing
    - creating ...

*/
import creds from '../config/stripe_key.json'
import Stripe from 'stripe';
const stripe = new Stripe(creds.api_public);

// Save users cards' by creating a SetupIntent
// https://stripe.com/docs/payments/save-and-reuse?platform=android&ui=payment-sheet
// Save Card without payment...

// create session
// supports : 3D auth
const createSession = async (user, amountInEGP, refData) => {
    try {

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
                setup_future_usage: "off_session"
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
                },
            ],
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

const capturePayment = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId)

        return paymentIntent
    } catch (e) {
        throw new Error(e.message)
    }
}
export default {
    createSession,
    createEvent,
    capturePayment
}