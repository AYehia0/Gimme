import reviewCont from '../controller/review.controller'
import { Router } from 'express'
import auth from '../middlewares/auth'

let router = Router()


router.post('/give-review/:reqId', auth.userAuth, reviewCont.giveReview)
router.get('/reviews', auth.userAuth, reviewCont.getUserReviews)

// exporting
export default router