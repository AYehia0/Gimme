import reviewService from './review.service'
import resp from '../../helpers/responseTemplate'
import success from '../../helpers/success'
import error from '../../helpers/error'


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

        const job = req.query.job

        if (!job)
            throw new error.ServerError(error.invalid.required("Job role"), 400) 

        const validJobs = ["mod", "customer"]

        if (! validJobs.includes(job))
            throw new error.ServerError(error.invalid.reviewQuery, 400) 

        const reviews = await reviewService.getUserReviews(req.user, job)

        res.send(resp(true, "", reviews))              
        
    } catch (e) {
        res.status(e.code || 400).send(resp(false, e.message, ""))              
    }
}


export default {
    giveReview,
    getUserReviews
}