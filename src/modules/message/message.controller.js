import messageService from "./message.service"
import resp from '../../helpers/responseTemplate'

const getChatMessages = async (req, res) => {
    try {
        const opt =  {
            page: parseInt(req.query.page) || 0,
            limit: parseInt(req.query.limit) || parseInt(process.env.CHAT_SIZE),
        } 
        const messages = await messageService.getChatMessages(req.user, req.params.roomId, opt)
        res.send(resp(true, "", messages))

    } catch (e) {
        res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}

export default {
    getChatMessages,
}