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
    title : {
        type : String,
        required : true,
        trim : true,
        maxlength : 250
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
    }
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review