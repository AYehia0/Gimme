const mongoose = require('mongoose')

const Schema = mongoose.Schema

// the location object
const locationObj = {
    loc : {
        type : {
            type : String,
            default: "Point"
        },
        coordinates : [Number]
    }
}
const requestSchema = new Schema({
    // the user who is requesting 
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    // the other user who accepted the job
    mod : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    title : {
        type : String, 
        trim : true,
        required : true,
        maxlength : 200
    },
    body : {
        type : String, 
        trim : true,
        required : true,
        maxlength : 300
    },
    // location is lat, long 
    // TODO : split the location to a sep relation
    fromLocation : {
        type : {
            type : String,
            default: "Point",
        },
        coordinates : [Number],
    },
    toLocation : {
        type : {
            type : String,
            default: "Point",
        },
        coordinates : [Number],
    },
    priceRange : {
        min : {
            type : Number,
            min : 0,
            validate: {
                validator: function(val){
                    const currMax = this.priceRange.max
                    return (currMax !== undefined ? val <= currMax : true)
                },
                message: "The MIN range with value {VALUE} must be <= than the max range!"
            }
        },
        max : {
            type : Number,
            min : 0,
            validate: {
                validator: function(val){
                    const currMin = this.priceRange.min
                    return (currMin !== undefined ? val >= currMin : true)
                },
                message: "The MAX range with value {VALUE} must be >= than the min range!"
            }
        }
    },
    timeRange : {
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
    state : {
        type : String,
        enum : ["closed", "deleted", "fulfilled", "on"],
        default : "on"
    },
    reviewed : {
        type : Boolean,
        default : false
    },
    // all the comments on the request
    // TODO : create a model for a comment [DONE]
    participants: [{
        userId : {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        commentId : {
            type : Schema.Types.ObjectId,
            ref : "Comment",
            required : true
        }
    }]
})

// giving the index to the schema
requestSchema.index({ fromLocation: "2dsphere" })
requestSchema.index({ toLocation: "2dsphere" })

const Request = mongoose.model('Request', requestSchema)

module.exports = Request