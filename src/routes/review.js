const router = require('express').Router()
const auth = require('../middlewares/auth.js')

// the controller
const reviewCont = require('../controller/user.review')

router.post('/give-review/:id', auth.userAuth, reviewCont.giveReview)
router.get('/reviews', auth.userAuth, reviewCont.getUserReviews)

// exporting
module.exports = router