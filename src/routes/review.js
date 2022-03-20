const router = require('express').Router()
const auth = require('../middlewares/auth.js')

// the controller
const reviewCont = require('../controller/user.review')

// write a review to a specific request maybe ? idk ?
router.post('/customer-review/:id', auth.userAuth, reviewCont.customerGiveReview)
router.post('/user-review/:id', auth.userAuth, reviewCont.userGiveReview)
router.get('/reviews', auth.userAuth, reviewCont.getUserReviews)

// exporting
module.exports = router