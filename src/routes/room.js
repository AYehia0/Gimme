const router = require('express').Router()
const auth = require('../middlewares/auth.js')

// the controller
const roomCont = require('../controller/userRoomController')

// create a room
router.post('/create-room', auth.userAuth, roomCont.startChat)

// exporting
module.exports = router
