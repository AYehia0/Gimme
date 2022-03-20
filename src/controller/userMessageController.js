const Room = require('../models/Room')
const Message = require('../models/Message')

const addMsgToChat = async (req, res) => {
    try {

        // the user to send
        const sender = req.user
        const roomId = req.params.id
        const message = req.body.text

        // check if the chatRoom exists or not
        if (! message)
            throw new Error("Message is required")

        const chatRoomExsits = await Room.findById(roomId)
        if (! chatRoomExsits)
            throw new Error("Chat doesn't exist")

        // Create a message 
        const msg = await Message.addMessageToChat(roomId, message, sender._id)

        // emit to the socket
        global.io.in(roomId).emit('new-msg', { message: msg })

        res.send({
            status: true,
            message: "",
            data: msg
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

const getChatMessages = async (req, res) => {
    try {
        const roomId = req.params.id

        const opt =  {
            page: parseInt(req.query.page) || 0,
            limit: parseInt(req.query.limit) || parseInt(process.env.CHAT_SIZE),
        } 

        const latestMessages = await Message.getRoomMessages(roomId, opt)

        // emit to the socket
        //global.io.in(roomId).emit('new-msg', { message: msg })

        res.send({
            status: true,
            message: "",
            data: latestMessages 
        })

    } catch (e) {
        let message = e.message
        res.send({
            status: false,
            message: message,
            data: ""
        })
    }
}



module.exports =  {
    addMsgToChat,
    getChatMessages,
}