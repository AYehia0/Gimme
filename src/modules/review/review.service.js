import Request from "../../models/Request"
import Review from "../../models/Review"
import error from "../../helpers/error"
import success from "../../helpers/success"

// a review can't be deleted, edited
// a user can't see the other review unless he submit their

// write a review
const addReviewToRequest = async (user, requestId, review) => {

    const request = await Request.findById(requestId)

    if (! request)
        throw new error.ServerError(error.request.notfound, 404) 

    if (! request.mod || request.state != "closed")
        throw new error.ServerError(error.request.noMod, 405) 
   
    await Request.addReview(user, request, review)
 
}

const getUserReviews = async (userId) => {

    // getting all the reviews where the reviewerId || toWhom equals to the userId
    const reviews = await Review.find({
        $or : [
            { toWhom : userId },
            { reviewerId : userId }
        ],
    })

    // return the reivews formated
    const formatedReviews = getFormatedReviews(userId, reviews)

    return formatedReviews

}

// format the returned reviews to be easy to read for frontend noobs
const getFormatedReviews = (userId, reviews) => {

    return {
        // check if the userId is mod
        as_mod : reviews.filter((review) => {
            if (review.reviewerId.equals(userId) && (review.flow == "mod"))
                return review
        }),
        // check if the userId is customer 
        as_customer: reviews.filter((review) => {
            if (review.reviewerId.equals(userId) && (review.flow == "customer"))
                return review
        }),
    }
}

export default {
    addReviewToRequest,
    getUserReviews
}