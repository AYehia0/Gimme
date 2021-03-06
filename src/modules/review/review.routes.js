import reviewCont from './review.controller'
import { Router } from 'express'
import auth from '../../middlewares/auth'

let router = Router()


router.post('/review/:reqId', auth.userAuth, reviewCont.giveReview)
router.get('/reviews/:userId', auth.userAuth, reviewCont.getUserReviews)

// exporting
export default router