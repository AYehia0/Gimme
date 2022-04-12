const mongoose = require('mongoose')

const Schema = mongoose.Schema

// the comment has : 
// userId related to the one who wrote it
// the actual comment 
// price 
// estimate time

const commentSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    text : {
        type : String, 
        trim : true,
        maxlength : 200
    },
    price : {
        type : Number,
        required : true
    },
    time : {
        unit : {
            type : String,
            enum : ["w", "d", "h"], // week, days, hours
            default : "d"
        },
        val : {
            type : Number,
            required : true
        }
    },
    // verify secret is used to generate a QR code for Request verification
    // it can only be scanned by the request maker
    // it can't be added by the request so it must be hidden.
    // also comment can't be deleted after the request is fulfilled
    // ToDo : it may be a good idea to make it expireable idk
    verify_secret: {
        type: String
    }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment 
