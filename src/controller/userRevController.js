const User = require('../models/User')
const Review = require('../models/Review')

// a review can't be deleted
// a review can't be edited

// write a review
const giveReview = async (req, res) => {
    try {
        // getting the user who writes the review
        const user = req.user

        
        
    } catch (e) {
        res.send({
            status: false,
            message: message,
            data: ""
        })
    }
}

module.exports = {
    giveReview
}