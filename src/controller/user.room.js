const Request = require('../models/Request')
const Comment = require('../models/Comment')
const User = require('../models/User')
const Room = require('../models/Room')

// get all the comments' info under a request
const startChat = async (req, res) => {
    try {

        // the maker
        const maker = req.user
        const userId = req.query.userId
        const reqId = req.query.reqId

        if (! userId || ! reqId)
            throw new Error("Invalid Syntax : userId and reqId are required!")

        // check if the user in the comments 
        // get object of all the comments in one request
        const request = await Request.findById(reqId)

        if (! request)
            throw new Error("Invalid ID : Make sure it's a RequestID and the comment exists !!!")

        const userCommentedInd = request.participants.findIndex((comment) => {
            return comment.userId.equals(userId)
        })

        if (userCommentedInd == -1) 
            throw new Error("Comment doesn't exist")
        
        // now create the room
        const chatRoomStatus = await Room.startChatRoom(maker._id, reqId, userId)
        
        res.send({
            status: true,
            message: chatRoomStatus.message,
            data: chatRoomStatus
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
    startChat,
}