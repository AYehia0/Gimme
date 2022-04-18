import reviewService from '../services/review.service'
import resp from '../helpers/responseTemplate'
import success from '../helpers/success'


// one controller for both customer and mod
const giveReview = async (req, res) => {
    try {

        await reviewService.addReviewToRequest(req.user, req.params.reqId, req.body)
        res.send(resp(true, success.review.added, ""))
        
    } catch (e) {
        res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}

// getting all the reviews of a user
const getUserReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getUserReviews(req.user, req.query.job)
        res.send(resp(true, "", reviews))              
        
    } catch (e) {
        res.status(e.code || 400).send(resp(false, e.message, ""))              
    }
}


export default {
    giveReview,
    getUserReviews
}