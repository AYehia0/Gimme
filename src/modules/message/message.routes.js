import messageCont from './message.controller'
import { Router } from 'express'
import auth from '../../middlewares/auth'
import chatAuth from '../../middlewares/chat'

let router = Router()

// get messages
router.get('/get-room-msgs/:roomId', auth.userAuth, chatAuth.chatAuth, messageCont.getChatMessages)

// exporting
export default router