import mongoose from 'mongoose'
const Schema = mongoose.Schema

const messageSchema = new Schema({
    roomId : {
        type : Schema.Types.ObjectId,
        ref : "Room",
        required : true
    },
    msg : mongoose.Schema.Types.Mixed,
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    type : {
        type : String,
        enum : ["text", "img", "url"],
        default: "text"
    },
    read : {
        type : Boolean,
        default : false
    },
    // TODO :  readAt ?

}, {timestamps : true})


// static method of the message
// add a message, etc
messageSchema.statics.addMessageToChat = async function (room, message, addedBy) {
    try {

        const msg = await this.create({
            roomId : room,
            msg : message,
            userId : addedBy
        })

        return msg

    } catch (e) {
        throw e
    }
}

// get some messages
// get latest 8 messages
// the opt is to skip some message just as pagging/indexing
messageSchema.statics.getRoomMessages = async function (roomId, opt={}) {

    const roomIdObj = mongoose.Types.ObjectId(roomId)

    const aggConv = await this.aggregate([
        {$match: {roomId: roomIdObj}},
        {$sort: {createdAt : -1}},

        // IMPORTANT : gettin pages 
        { $skip: opt.page * opt.limit },

        { $limit: opt.limit },

        // sorting latest first
        { $sort: { createdAt: -1 } },
    ])

    return aggConv
}

// creating the model 
const Message = mongoose.model('Message', messageSchema)

// exporting
export default Message