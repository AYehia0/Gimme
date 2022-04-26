import Message from "../../models/Message"
import messageValidation from "./message.validation"

const getChatMessages = async (roomId, options) => {

    const opt = messageValidation(options)

    const conversation = await Message.getRoomMessages(roomId, opt)

    return conversation
}

export default {
    getChatMessages
}