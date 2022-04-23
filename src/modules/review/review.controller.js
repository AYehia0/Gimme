import reviewService from './review.service'
import resp from '../../helpers/responseTemplate'
import success from '../../helpers/success'
import error from '../../helpers/error'


// one controller for both customer and mod
const giveReview = async (req, res) => {
    try {

        const requestId = req.params.reqId
        const review = req.body

        if (! requestId)
            throw new error.ServerError(error.invalid.required("RequestId"), 400) 
        
        if (! review.comment || ! review.rate.toString())
            throw new error.ServerError(error.invalid.required("Comment/Rate"), 400) 

        await reviewService.addReviewToRequest(req.user, requestId, review)

        res.send(resp(true, success.review.added, ""))
        
    } catch (e) {
        res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}

// getting all the reviews of a user
const getUserReviews = async (req, res) => {
    try {

        const userId = req.query.userId

        const reviews = await reviewService.getUserReviews(userId)

        res.send(resp(true, "", reviews))              
        
    } catch (e) {
        res.status(e.code || 400).send(resp(false, e.message, ""))              
    }
}


export default {
    giveReview,
    getUserReviews
}