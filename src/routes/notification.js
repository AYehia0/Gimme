import notifyCont from '../controller/notification.controller'
import { Router } from 'express'
import auth from '../middlewares/auth'

let router = Router()


router.post('/update', auth.userAuth, notifyCont.updateUserToken)

export default router