const mongoose = require('mongoose')
const Request = require('../models/Request')
const Comment = require('../models/Comment')

// write a comment/proposal
const giveComment = async (req, res) => { 
    try {

        const reqId = req.params.id
        const comment = req.body
        const user = req.user

        // check if the request is a valid one : exists
        const reqValid = await Request.findById(reqId)

        if (! reqValid)
            throw new Error("Request not found !!!")

        // check if tiveCommenthe mod isn't choosen yet : you can't comment then
        // ????
        if (reqValid.mod)
            throw new Error("MOD is already choosen !!!")

        // user can only add one comment, for this request
        
        const userCommentedInd = reqValid.participants.findIndex((comment) => {
            return comment.userId.equals(user._id)
        })

        if (userCommentedInd !== -1) 
            throw new Error("User has already commented !!!")

        // check if the user commenting isn't the one who created the request lol
        if (reqValid.userId.equals(user._id))
            throw new Error("LOL, does the train hit you before ?")

        // adding the comment
        // check if the user is allowed to do so : by default ALLOWED

        // validation 
        // check if the price is valid : greater than or equal to min range

        // getting the min range
        const minPrice = reqValid.priceRange.min

        // TODO : is it safe ?
        if (comment.price < minPrice)
            throw new Error("Price can't be less than the minimum range")

        const newComment = new Comment({
            userId : user._id,
            text : comment.text,
            price : comment.price,
            time : comment.time
        })

        // saving
        await newComment.save()

        // adding the comment id to the request
        // TODO : there is a better way using the already declared reqValid
        await Request.findByIdAndUpdate(reqId, {
            $push : {
                participants : {
                    userId : user._id,
                    commentId : newComment._id
                }
            }
        })

        res.send({
            status: true,
            message: "Success: Comment has been added !!!",
            data: comment
        })   
        
    } catch (e) {
        const message = e.message
        res.send({
            status: false,
            message: message,
            data: ""
        })
    }
}

// edit a comment
// by the request id : if user commented already
const editComment = async (req, res) => {
    try {

        // the id of the request
        const id = req.params.id
        const user = req.user
        const comment = req.body

        // check if the id is valid
        const checkId = await Request.findById(id)

        if (! checkId)
            throw new Error("Invalid ID : Make sure it's a RequestID and the comment exists !!!")
        
        // validation
        // finding the comment of the user in the participants
        const userCommentedInd = checkId.participants.findIndex((comment) => {
            return comment.userId.equals(user._id)
        })

        if (userCommentedInd == -1) 
            throw new Error("Comment doesn't exist")

        // edit the comment : validation
        // getting the comment
        const userComment = checkId.participants[userCommentedInd]
        const minPrice = checkId.priceRange.min

        // TODO : is it safe ?
        if (comment.price < minPrice)
            throw new Error("Price can't be less than the minimum range")

        await Comment.findByIdAndUpdate(userComment.commentId, {
            text : comment.text,
            price : comment.price,
            time : comment.time
        })
       
        res.send({
            status: true,
            message: "Success : Comment has been edited !!!",
            data: comment
        })
   
    } catch (e) {
        const message = e.message
        res.send({
            status: false,
            message: message,
            data: ""
        })
    }
}

// delete a comment : make sure you're not the MOD
// delete from the participants list and from Comments
// TODO : Delete from one place and automatically delete the other by setting a method on the db side
const deleteComment = async (req, res) => {
    try {

        // the request id
        const id = req.params.id
        const user = req.user

        // check if the id is valid
        const checkId = await Request.findById(id)

        if (! checkId)
            throw new Error("Invalid ID : Make sure it's a RequestID and the comment exists !!!")
        
        // validation
        // finding the comment of the user in the participants
        const userCommentedInd = checkId.participants.findIndex((comment) => {
            return comment.userId.equals(user._id)
        })

        if (userCommentedInd == -1) 
            throw new Error("Comment doens't exist")
        
        // getting the commnetID 
        const commentId = checkId.participants[userCommentedInd].commentId

        // delete from the participants list
        checkId.participants.splice(userCommentedInd, 1)
        await checkId.save()

        // delete from the Comment model
        await Comment.findByIdAndDelete(commentId)

        res.send({
            status: true,
            message: "Comment has been deleted !!!",
            data: ""
        })

    } catch (e) {
        const message = e.message
        res.send({
            status: false,
            message: message,
            data: ""
        })
    }
}

// get all the comments' info under a request
const getComments = async (req, res) => {
    try {
        // request id 
        let comments = []
        const id = req.params.id

        // check if the id is valid
        const checkId = await Request.findById(id)

        if (!checkId)
            throw new Error("Invalid ID : Make sure it's a valid RequestID")
        
        // the comments exists in the participants list
        const commentIDs = checkId.participants.map(part => {
            return part.commentId
        })

        if (commentIDs.length != 0)
            comments = await Comment.find().where('commentId').in(commentIDs).exec()

        res.send({
            status: true,
            message: "",
            data: comments
        })
        
    } catch (e) {
        const message = e.message
        res.send({
            status: false,
            message: message,
            data: ""
        })
    }
}

module.exports =  {
    giveComment,
    editComment,
    getComments,
    deleteComment
}