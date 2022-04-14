const router = require('express').Router()
const auth = require('../middlewares/auth')
const authComment = require('../middlewares/comment')

// the controller
const requestCont = require('../controller/user.request')

// search requests
router.get('/search', auth.userAuth, requestCont.searchRequests)

// get all the requests users posted OR get a certain request by id
// only the auth user can call this
router.get('/requests', auth.userAuth, requestCont.getRequests)

// my work
router.get('/subscribed', auth.userAuth, requestCont.getSubscibedRequests)

// open a request
router.post('/open', auth.userAuth, requestCont.openRequest)

// edit a request
router.put('/edit/:id', auth.userAuth, requestCont.editRequest)

// delete a request
router.delete('/delete/:id', auth.userAuth, requestCont.deleteRequest)

// exporting
module.exports = router