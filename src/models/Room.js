import mongoose from 'mongoose'
const Schema = mongoose.Schema

const roomSchema = new Schema({
    roomMaker : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    requestId : {
        type : Schema.Types.ObjectId,
        ref : "Request",
        required : true
    },
    // the user is the mod
    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
}, {timestamps : true})

// static method of the room 
// create the room aka start

// Create the chat room 
// to start a chatRoom : chatMaker can do if the mod(to be) in the comments
// needs the requestId and the userId(mod)
roomSchema.statics.startChatRoom = async function (request, chatMaker, mod) {

    // check if the chat room between them is already there before ?
    const roomThere = await this.findOne({
        $or : [
            { chatMaker : chatMaker, user : mod },
            { chatMaker : mod, user : chatMaker }
        ]
    })

    if (roomThere)
        return {
            new : false,
            message : "Fetching old messages",
            roomId : roomThere._id
        }

    // create a new one
    const newRoom = await this.create({
        roomMaker : chatMaker,
        requestId : request,
        user : mod
    })

    return {
        new : true,
        message : "Creating new room",
        roomId : newRoom._id
    }
}

// creating the model 
const Room = mongoose.model('Room', roomSchema)

// exporting
export default Room