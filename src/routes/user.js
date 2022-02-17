const router = require('express').Router()
const auth = require('../middlewares/auth.js')

// the controller
const userCont = require('../controller/userRegController.js')

// register a user
router.post('/register', userCont.registerUser)

// login a user
router.post('/login', userCont.loginUser)

// show your profile
router.get('/profile', auth.userAuth , userCont.getUserProfile)

// login a user
router.get('/logout', userCont.logoutUser)

// exporting
module.exports = router
