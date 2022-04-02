const router = require('express').Router()
const auth = require('../middlewares/auth.js')

// the controller
const notifyCont = require('../controller/user.notification')

router.post('/update', auth.userAuth, notifyCont.updateUserToken)

module.exports = router