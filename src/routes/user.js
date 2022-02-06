const router = require('express').Router()

// the controller
const userCont = require('../controller/userController.js')

// register a user
router.post('/register', userCont.registerUser)

// exporting
module.exports = router
