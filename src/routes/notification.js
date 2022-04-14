import notifyCont from '../controller/user.notification'
import { Router } from 'express'
import auth from '../middlewares/auth'

let router = Router()


router.post('/update', auth.userAuth, notifyCont.updateUserToken)

export default router