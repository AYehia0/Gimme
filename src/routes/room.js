const router = require('express').Router()
const auth = require('../middlewares/auth.js')

// the controller
const roomCont = require('../controller/user.room')

// create a room
router.post('/create-room', auth.userAuth, roomCont.startChat)

// block someone
// deleting a chat w
//router.delete('/block-room', auth.userAuth, roomCont.blockChat)

// exporting
module.exports = router
