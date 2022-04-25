import error from '../../helpers/error'
import Request from '../../models/Request'
import Room from '../../models/Room'
import roomValidation from './room.validation'

const initChatRoom = async (maker, data) => {

    const {reqId, modId} = roomValidation.validateRoomInit(data)
    // check if the user in the comments 
    // get object of all the comments in one request
    const request = await Request.findById(reqId)

    if (! request)
        throw new error.ServerError(error.request.notfound, 404)

    // can't start a chat, if you're not the request maker
    if (! request.userId.equals(maker._id))
        throw new error.ServerError(error.user.auth, 404)

    const comment = request.participants.find((comment) => {
        return comment.userId.equals(modId)
    })

    if (!comment)
        throw new error.ServerError(error.comment.notfound, 404)

    // now create the room
    const status = await Room.startChatRoom(reqId, maker._id, modId)
 
    return status 
}

export default {
    initChatRoom   
}