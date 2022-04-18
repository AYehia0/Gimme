import Message from "../models/Message"

// user must be one in the party room
const getChatMessages = async (user, roomId, opt) => {

    const conversation = await Message.getRoomMessages(roomId, opt)

    return conversation
}

export default {
    getChatMessages
}