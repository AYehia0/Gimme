import { Router } from 'express'
import auth from '../../middlewares/auth'
import requestCont from './request.controller'

let router = Router()


// search requests
router.get('/search', auth.userAuth, requestCont.searchRequests)

// get all the requests users posted OR get a certain request by id
// only the auth user can call this
router.get('/requests', auth.userAuth, requestCont.getRequests)

// my work
router.get('/subscribed', auth.userAuth, requestCont.getSubscibedRequests)

// requests i commented on, and it has state of 'on'
router.get('/on', auth.userAuth, requestCont.getMyCommentedRequests)

// open a request
router.post('/open', auth.userAuth, requestCont.openRequest)

// edit a request
router.put('/edit/:reqId', auth.userAuth, requestCont.editRequest)

// delete a request
router.delete('/delete/:reqId', auth.userAuth, requestCont.deleteRequest)

// exporting
export default router