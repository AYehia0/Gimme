import roomCont from '../controller/room.controller'
import { Router } from 'express'
import auth from '../middlewares/auth'

let router = Router()


// create a room
router.post('/create-room', auth.userAuth, roomCont.startChat)

// block someone
// deleting a chat w
//router.delete('/block-room', auth.userAuth, roomCont.blockChat)

// exporting

export default router