import commentCont from './comment.controller'
import { Router } from 'express'
import auth from '../../middlewares/auth'

let router = Router()

// write a comment
router.post('/comment/:reqId', auth.userAuth, commentCont.giveComment)

// edit a comment
// we can pass the comment id or the request id : as it's just one-to-one
router.put('/comment/:reqId', auth.userAuth, commentCont.editComment)

// delete a comment
router.delete('/comment', auth.userAuth, commentCont.deleteComment)

// get all the comment of a request
// by doing this : i make sure to sep the comments from the request itself, means you will need extra request to load all the comments
router.get('/comment/:reqId', auth.userAuth, commentCont.getComments)

// get the payment verification secret 
router.get('/secret/:reqId', auth.userAuth, commentCont.getVerfificationSecret)

// exporting
export default router