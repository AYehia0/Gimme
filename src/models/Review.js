const mongoose = require('mongoose')

const Schema = mongoose.Schema

const reviewSchema = new Schema({
    reviewerId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    toWhom : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    requestId : {
        type : Schema.Types.ObjectId,
        ref : "Request",
        required : true
    },
    title : {
        type : String,
        required : true,
        trim : true,
        maxlength : 200
    },
    body : {
        type : String,
        trim : true,
        maxlength : 300
    },
    rate : {
        type : Number,
        required : true,
        min : 1,
        max : 5
    },
    // the flow flag : determines what the job of the user who gave the review
    flow : {
        type : String,
        enum : ["user", "customer"],
        required : true
    }
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review