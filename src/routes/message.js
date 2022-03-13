const router = require('express').Router()
const auth = require('../middlewares/auth.js')

// the controller
const messageCont = require('../controller/userMessageController')

// create a message in a chat room(id)
router.post('/create-msg/:id', auth.userAuth, messageCont.addMsgToChat)

// get messages
router.get('/get-room-msgs/:id', auth.userAuth, messageCont.getChatMessages)

// exporting
module.exports = router
