const router = require('express').Router()
const auth = require('../middlewares/auth.js')

// the controller
const commentCont = require('../controller/user.comment')

// write a comment
router.post('/comment/:id', auth.userAuth, commentCont.giveComment)

// edit a comment
// we can pass the comment id or the request id : as it's just one-to-one
router.put('/comment/:id', auth.userAuth, commentCont.editComment)

// delete a comment
router.delete('/comment/:id', auth.userAuth, commentCont.deleteComment)

// get all the comment of a request
// by doing this : i make sure to sep the comments from the request itself, means you will need extra request to load all the comments
router.get('/comment/:id', auth.userAuth, commentCont.getComments)


// exporting
module.exports = router