import reviewCont from '../controller/user.review'
import { Router } from 'express'
import auth from '../middlewares/auth'

let router = Router()


router.post('/give-review/:id', auth.userAuth, reviewCont.giveReview)
router.get('/reviews', auth.userAuth, reviewCont.getUserReviews)

// exporting
export default router