import messageCont from '../controller/user.message'
import { Router } from 'express'
import auth from '../middlewares/auth'
import chatAuth from '../middlewares/chat'

let router = Router()

// get messages
router.get('/get-room-msgs/:id', auth.userAuth, chatAuth.chatAuth, messageCont.getChatMessages)

// exporting
export default router