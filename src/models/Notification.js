import mongoose from 'mongoose'

// the notification profile
const userNotificaitonSchema = new mongoose.Schema({

    // the profile
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        unique : true
    },
    notification_token : {
        type : String,
        unique : true,
        required : true
    },
    notifications : [{
        reqId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Request"
        },
        fromUser : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        message : {
            type : String,
            trim : true,
        },
    }, { timestamps: true }]
})

const Notification = mongoose.model('Notification', userNotificaitonSchema)

export default Notification 