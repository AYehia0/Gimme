import messageService from "./message.service"
import resp from '../../helpers/responseTemplate'
import { ZodError } from "zod"

const getChatMessages = async (req, res) => {
    try {

        const opt =  {
            page: parseInt(req.query.page) || 0,
            limit: parseInt(req.query.limit) || parseInt(process.env.CHAT_SIZE),
        } 

        const messages = await messageService.getChatMessages(req.body.roomId, req.query)

        res.send(resp(true, "", messages))

    } catch (e) {

        if (e instanceof ZodError)
            return res.status(e.code || 400).send(resp(false, e.flatten(), ""))

        res.status(400).send(resp(false, e.message, ""))
    }
}

export default {
    getChatMessages,
}