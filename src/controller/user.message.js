import Message from '../models/Message'

const getChatMessages = async (req, res) => {
    try {

        // the user to send
        const roomId = req.params.id

        const opt =  {
            page: parseInt(req.query.page) || 0,
            limit: parseInt(req.query.limit) || parseInt(process.env.CHAT_SIZE),
        } 

        // make sure that the user is : maker or MOD
        // ...
        const chatConv = await Message.getRoomMessages(roomId, opt)

        // emit to the socket
        //global.io.in(roomId).emit('new-msg', { message: msg })

        res.send({
            status: true,
            message: "",
            data: chatConv 
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

export default {
    getChatMessages,
}