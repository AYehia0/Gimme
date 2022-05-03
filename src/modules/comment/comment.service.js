import Comment from '../../models/Comment'
import Request from '../../models/Request'
import error from '../../helpers/error'
import globalValidation from '../../helpers/validation'
import commentValidation from './comment.validation'

// helper functions for comment validations

// checks if a user already commented on a request
// return comment's index in the participants list inside the request
const getUserComment = (user, request, commentId) => {

    const commentIndex = request.participants.findIndex((comment) => {
        return comment.userId.equals(user._id) && (comment.commentId == commentId) 
    })

    return commentIndex 
}


// add a comment for a user on a request
// returns the added comment
const addComment = async (user, reqId, commentData) => {

    // check if the request is a valid one : exists
    const requestId = globalValidation.validateId(reqId, "reqId")

    const request = await Request.findById(requestId)

    if (! request) 
        throw new error.ServerError(error.request.notfound, 404)
    
    // the mod is choosen : can't add comment then
    if (request.mod) 
        throw new error.ServerError(error.request.modChoosen, 409)

    // getting the comment index
    const userCommented = request.participants.find((comment) => {
        return comment.userId.equals(user._id)
    })

    // comment exists
    if (userCommented)
        throw new error.ServerError(error.comment.commented, 405)

    // check if the user commenting isn't the one who created the request lol
    if (request.userId.equals(user._id))
        throw new error.ServerError(error.comment.yourRequest, 405)

    // the user didn't setup hi payment account
    if (!user.account_id)
        throw new error.ServerError(error.user.noAccount, 409)

    // adding the comment
    // check if the user is allowed to do so : by default ALLOWED

    // validation 
    // check if the price is valid : greater than or equal to min range
    const comment = commentValidation.validateComment(commentData)

    // getting the min range
    const minPrice = request.priceRange.min

    // TODO : is it safe ?
    if (comment.price < minPrice)
        throw new error.ServerError(error.comment.price, 405)

    const newComment = new Comment({
        userId : user._id,
        ...comment
    })

    // saving
    await newComment.save()

    // adding the comment id to the request
    // TODO : there is a better way using the already declared request
    await Request.findByIdAndUpdate(requestId, {
        $push : {
            participants : {
                userId : user._id,
                commentId : newComment._id
            }
        }
    })

    return newComment
}

const editComment = async (user, reqId, commentData) => {

    const requestId = globalValidation.validateId(reqId, "reqId")

    // check if the id is valid
    const request = await Request.findById(requestId)

    if (! request)
        throw new error.ServerError(error.request.notfound, 404)
        
    if (request.mod)
        throw new error.ServerError(error.request.modChoosen, 403)
   
    const userComment = request.participants.find((comment) => {
        return comment.userId.equals(user._id)
    })

    if (!userComment) 
        throw new error.ServerError(error.comment.notfound, 404)

    if (userComment.price < request.priceRange.min)
        throw new error.ServerError(error.comment.price, 405)

    const comment = commentValidation.validateComment(commentData)

    return await Comment.findByIdAndUpdate(userComment.commentId, comment, {new: true})
 
}

// delete a comment by 
const deleteComment = async (user, reqId, commentId) => {

    const requestId = globalValidation.validateId(reqId, "reqId")

    const request = await Request.findById(requestId)

    if (! request) 
        throw new error.ServerError(error.request.notfound, 404)
    
    // if the mod is choosen and the mod is the owner of the comment
    // user can't delete the comment if he's the mod 
    if (request.mod == user._id) 
        throw new error.ServerError(error.comment.delete, 405)

    // check if the commentId is the one the user posted
    const userCommentedInd = getUserComment(user, request, commentId)

    // doesn't exist
    if (userCommentedInd === -1)
        throw new error.ServerError(error.comment.notfound, 409)

    await request.deleteComment(commentId)
    
}

const getRequestComments = async (reqId) => {

    let comments = []

    const requestId = globalValidation.validateId(reqId, "reqId")

    // check if the id is valid
    const request = await Request.findById(requestId)

    if (!request)
        throw new error.ServerError(error.request.notfound, 404)
    
    // the comments exists in the participants list
    const commentIDs = request.participants.map(part => {
        return part.commentId
    })

    if (commentIDs.length != 0)
        comments = await Comment.find({_id: {$in: commentIDs}})

    return comments
}

const getVerificationCode = async (user, reqId) => {

    const requestId = globalValidation.validateId(reqId, "reqId")

    const request = await Request.findById(requestId)

    if (! request)
        throw new error.ServerError(error.request.notfound, 404)

    if (! request.mod)
        throw new error.ServerError(error.request.noMod, 409)

    if (! request.mod.equals(user._id))
        throw new error.ServerError(error.user.auth, 401)

    const verifyToken = await Comment.getVerifyToken(user._id, request)

    return verifyToken

}


export default {
    addComment,
    editComment,
    deleteComment,
    getRequestComments,
    getVerificationCode
}