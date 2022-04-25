import roomService from './room.service'
import resp from '../../helpers/responseTemplate'
import { ZodError } from 'zod'

// get all the comments' info under a request
const startChat = async (req, res) => {
    try {

        const data = req.body

        const chatRoomStatus = await roomService.initChatRoom(req.user, data)

        res.send(resp(true, chatRoomStatus.message, chatRoomStatus))
       
    } catch (e) {
        if (e instanceof ZodError)
            return res.status(e.code || 400).send(resp(false, e.flatten(), ""))

        res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}
export default  {
    startChat,
}