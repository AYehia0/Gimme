const router = require('express').Router()
const auth = require('../middlewares/auth.js')

// the controller
const requestCont = require('../controller/requestController')

// handle requests : create a request, choose a MOD, update a request

// open a request
router.post('/open', auth.userAuth, requestCont.openRequest)

// edit a request
router.post('/edit/:id', auth.userAuth, requestCont.editRequest)

// delete a request
router.get('/delete/:id', auth.userAuth, requestCont.deleteRequest)

// close a request
// a request is closed when a MOD is choosen
router.get('/mod', auth.userAuth, requestCont.closeRequest)


// exporting
module.exports = router