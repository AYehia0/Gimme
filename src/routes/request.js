import { Router } from 'express'
import auth from '../middlewares/auth'
import requestCont from '../controller/user.request'

let router = Router()


// search requests
router.get('/search', auth.userAuth, requestCont.searchRequests)

// get all the requests users posted OR get a certain request by id
// only the auth user can call this
router.get('/requests', auth.userAuth, requestCont.getRequests)

// my work
router.get('/subscribed', auth.userAuth, requestCont.getSubscibedRequests)

// open a request
router.post('/open', auth.userAuth, requestCont.openRequest)

// edit a request
router.put('/edit/:id', auth.userAuth, requestCont.editRequest)

// delete a request
router.delete('/delete/:id', auth.userAuth, requestCont.deleteRequest)

// exporting
export default router