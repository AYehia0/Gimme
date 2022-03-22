const router = require('express').Router()
const auth = require('../middlewares/auth.js')
const chatAuth = require('../middlewares/chat')

// the controller
const messageCont = require('../controller/user.message')

// get messages
router.get('/get-room-msgs/:id', auth.userAuth, chatAuth.chatAuth, messageCont.getChatMessages)

// exporting
module.exports = router
