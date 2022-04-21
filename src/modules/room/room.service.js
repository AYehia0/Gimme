import Request from '../../models/Request'
import Room from '../../models/Room'

const initChatRoom = async (maker, mod, requestId) => {

    // check if the user in the comments 
    // get object of all the comments in one request
    const request = await Request.findById(requestId)

    if (! request)
        throw new Error("Invalid ID : Make sure it's a RequestID and the comment exists !!!")

    const userCommentedInd = request.participants.findIndex((comment) => {
        return comment.userId.equals(userId)
    })

    if (userCommentedInd == -1) 
        throw new Error("Comment doesn't exist")
    
    // now create the room
    const status = await Room.startChatRoom(maker._id, reqId, userId)
 
    return status 
}

export default {
    initChatRoom   
}