const router = require('express').Router()
const auth = require('../middlewares/auth.js')
const chatAuth = require('../middlewares/chat')

// the controller
const messageCont = require('../controller/user.message')

// create a message in a chat room(id)
router.post('/create-msg/:id', auth.userAuth, chatAuth.chatAuth, messageCont.addMsgToChat)

// get messages
router.get('/get-room-msgs/:id', auth.userAuth, chatAuth.chatAuth, messageCont.getChatMessages)

// exporting
module.exports = router
