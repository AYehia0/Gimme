const Request = require("../models/Request")
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

module.exports =  {
    getPublishKey,
}