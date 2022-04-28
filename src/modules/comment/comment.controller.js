import commentService from './comment.service'
import error from '../../helpers/error'
import success from '../../helpers/success'
import resp from '../../helpers/responseTemplate'
import { ZodError } from 'zod'

// write a comment/proposal
const giveComment = async (req, res) => { 
    try {

        const requestId = req.params.reqId

        const comment = await commentService.addComment(req.user, requestId, req.body)

        res.send(resp(true, success.comment.added, comment))   
        
    } catch (e) {
        if (e instanceof ZodError)
            return res.status(400).send(resp(false, e.flatten(), ""))

        if (e.code == 11000)
            return res.status(409).send(resp(false, error.comment.commented, ""))

        res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}

// edit a comment
// by the request id : if user commented already
const editComment = async (req, res) => {
    try {

        await commentService.editComment(req.user, req.params.reqId, req.body)
        res.send(resp(true, success.comment.edited, ""))
   
    } catch (e) {
        if (e instanceof ZodError)
            return res.status(400).send(resp(false, e.flatten(), ""))

       res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}

// delete a comment : make sure you're not the MOD
// delete from the participants list and from Comments
// TODO : Delete from one place and automatically delete the other by setting a method on the db side
const deleteComment = async (req, res) => {
    try {
        await commentService.deleteComment(req.user, req.body.reqId, req.body.commentId)

        res.send(resp(true, success.comment.deleted, ""))

    } catch (e) {
        if (e instanceof ZodError)
            return res.status(400).send(resp(false, e.flatten(), ""))

       res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}

// get all the comments' info under a request
const getComments = async (req, res) => {
    try {
        const comments = await commentService.getRequestComments(req.params.reqId)
        res.send(resp(true, "", comments))
        
    } catch (e) {
        if (e instanceof ZodError)
            return res.status(400).send(resp(false, e.flatten(), ""))

      res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}

// return verification token only by MOD
// search the request to find if the request's choosen man is the user._id
const getVerfificationSecret = async (req, res) => {
    try {

        const verifyToken = await commentService.getVerificationCode(req.user, req.params.reqId)
        res.send(resp(true, "", verifyToken))
   
    } catch (e) {
        if (e instanceof ZodError)
            return res.status(400).send(resp(false, e.flatten(), ""))

        res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}


export default {
    giveComment,
    editComment,
    getComments,
    deleteComment,
    getVerfificationSecret
}