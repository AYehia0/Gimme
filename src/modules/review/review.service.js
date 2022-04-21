import Request from "../../models/Request"
import Review from "../../models/Review"
import error from "../../helpers/error"
import success from "../../helpers/success"

// a review can't be deleted, edited
// a user can't see the other review unless he submit their

// write a review
const addReviewToRequest = async (user, requestId, review) => {

    if (! review.comment || ! review.rate)
        throw new error.ServerError(error.invalid.required("Comment/Rate"), 400) 

    const request = await Request.findById(requestId)

    if (! request)
        throw new error.ServerError(error.request.notfound, 404) 

    if (! request.mod || request.state != "fulfilled")
        throw new error.ServerError(error.request.noMod, 405) 
   
    await Request.addReview(user, request, review)
 
}

const getUserReviews = async (user, job) => {

    let reviews = []

    const validJobs = ["user", "customer"]

    if (! validJobs.includes(job))
        throw new error.ServerError(error.invalid.required("Job role"), 400) 

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

    return reviews

}

export default {
    addReviewToRequest,
    getUserReviews
}