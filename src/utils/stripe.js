/*
This util contains the payment functions :
    - save the user's credit card
        - attach the customer token to the User OR split it to another document in the db
    - holding the money
    - releasing
    - creating ...

*/
const creds = require("../config/stripe_key.json")
const stripe = require('stripe')(creds.api_secret)
const User = require("../models/User")


// save card
const saveCreditCard = async (user, paymentMethod) => {

    // check if the customer exists
    const customer = await stripe.customers.create({
        payment_method: paymentMethod
    })



}


module.exports = {

}