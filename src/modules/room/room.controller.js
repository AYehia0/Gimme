import roomService from './room.service'
import resp from '../../helpers/responseTemplate'
import error from '../../helpers/error'

// get all the comments' info under a request
const startChat = async (req, res) => {
    try {

        // the maker
        const maker = req.user
        const modId = req.query.modId
        const reqId = req.query.reqId

        if (! modId || ! reqId)
            throw new error.ServerError(error.invalid.required("Request/User ID"), 400)

        const chatRoomStatus = await roomService.initChatRoom(maker, modId, reqId)

        res.send(resp(true, chatRoomStatus.message, chatRoomStatus))
       
    } catch (e) {
        res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}
export default  {
    startChat,
}