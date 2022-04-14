import Request from '../models/Request'
import Review from '../models/Review'

// a review can't be deleted
// a review can't be edited
// a user can't see the other review unless he submit their

// write a review
// one route for both customer and mod
const giveReview = async (req, res) => {
    try {

        // the body of the review
        const { comment, rate } = req.body

        // the id of the request
        const reqId = req.params.id

        // getting the user who writes the review
        const user = req.user

        // add 
        await Request.addReview(reqId, user, req.body)

        res.send({
            status: true,
            message: "Review has been added !!!",
            data: ""
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


export default {
    giveReview,
    getUserReviews
}