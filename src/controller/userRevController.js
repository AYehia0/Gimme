const Request = require('../models/Request')
const Review = require('../models/Review')

// a review can't be deleted
// a review can't be edited
// a user can't see the other review unless he submit their

// write a review
const customerGiveReview = async (req, res) => {
    try {

        // the body of the review
        const { comment, rate } = req.body

        // the id of the request
        const reqId = req.params.id

        // getting the user who writes the review
        const user = req.user

        // check if the customer is the one who created the request
        const requestOfUser = await Request.findById(reqId)

        if (! requestOfUser)
            throw new Error("Request not found !!!")

        if (! requestOfUser.userId.equals(user._id))
            throw new Error("Not authorized !!!")

        // adding the review
        // getting the mod_id and state of the request
        const { mod, state } = requestOfUser
        console.log(mod, state)
        if (! mod || state != "fulfilled")
            throw new Error("Request isn't fulfilled yet !!!")

        // TODO : check if user have pushed a review or not
        if (requestOfUser.reviewed == true)
            throw new Error("You've already pushed a review !!!")

        const newReview = new Review({
            reviewerId : user._id,
            toWhom : mod,
            requestId : requestOfUser._id,
            title : requestOfUser.title,
            body : comment,
            rate : rate,
            flow : "customer"
        })

        await newReview.save()

        // flagging the request to be reviewed
        requestOfUser.reviewed = true
        await requestOfUser.save()

        res.send({
            status: true,
            message: "Review has been added !!!",
            data: newReview
        })
        
    } catch (e) {
        const message = e.message
        res.send({
            status: false,
            message: message,
            data: ""
        })
    }
}
// now the user gives back, can't give unless the customer has already done so
const userGiveReview = async (req, res) => {
    try {

        const user = req.user
        const reqId = req.params.id
        const { comment, rate } = req.body
        const requestOfUser = await Request.findById(reqId)

        if (! requestOfUser)
            throw new Error("Request not found !!!")

        // a silly check for the customer
        if (requestOfUser.userId.equals(user._id))
            throw new Error("Not authorized/ Wrong route !!!")
        
        // TODO : check if user have pushed a review or not
        if (requestOfUser.reviewed == false)
            throw new Error("You can't push a review yet !!!")

        const newReview = new Review({
            reviewerId : user._id,
            toWhom : requestOfUser.userId,
            requestId : requestOfUser._id,
            title : requestOfUser.title,
            body : comment,
            rate : rate,
            flow : "user"
        })

        await newReview.save()

        // closing the request
        requestOfUser.state = "closed"
        await requestOfUser.save()

        res.send({
            status: true,
            message: "Review has been added !!!",
            data: newReview
        })
    } catch (e) {
        const message = e.message
        res.send({
            status: false,
            message: message,
            data: ""
        })       
    }
}

// getting all the reviews of a user
const getUserReviews = async (req, res) => {
    try {

        // getting the userId
        const user = req.user
        const job = req.query.job
        const validJobs = ["user", "customer"]
        let reviews = []

        if (! validJobs.includes(job))
            throw new Error("Required arg : job")

        // getting all the reviews where the reviewerId || toWhom equals to the userId
        if (job == "customer")
            reviews = await Review.find({
                toWhom : user._id,
                flow : "customer"
            })
        else if (job == "user")
            reviews = await Review.find({
                toWhom : user._id,
                flow : "user"
            })

        res.send({
            status: true,
            message: "",
            data: reviews
        })              
        
    } catch (e) {
        const message = e.message
        res.send({
            status: false,
            message: message,
            data: ""
        })              
    }
}
module.exports = {
    customerGiveReview,
    userGiveReview,
    getUserReviews
}