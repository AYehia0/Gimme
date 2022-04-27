import reviewService from './review.service'
import resp from '../../helpers/responseTemplate'
import success from '../../helpers/success'
import error from '../../helpers/error'
import { ZodError } from 'zod'

// one controller for both customer and mod
const giveReview = async (req, res) => {
    try {

        const requestId = req.params.reqId
        const review = req.body

        await reviewService.addReviewToRequest(req.user, requestId, review)

        res.send(resp(true, success.review.added, ""))
        
    } catch (e) {
        if (e instanceof ZodError)
            return res.status(e.code || 400).send(resp(false, e.flatten(), ""))

        res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}

// getting all the reviews of a user
const getUserReviews = async (req, res) => {
    try {

        const userId = req.params.userId

        const reviews = await reviewService.getUserReviews(userId)

        res.send(resp(true, "", reviews))              
        
    } catch (e) {
        if (e instanceof ZodError)
            return res.status(e.code || 400).send(resp(false, e.flatten(), ""))

        res.status(e.code || 400).send(resp(false, e.message, ""))              
    }
}


export default {
    giveReview,
    getUserReviews
}