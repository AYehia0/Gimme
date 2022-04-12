const mongoose = require('mongoose')
const Review = require('./Review')
const Comment = require('./Comment')

const Schema = mongoose.Schema

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
    toAddress : {
        type: String,
    },
    fromAddress : {
        type: String,
    },
    priceRange : {
        min : {
            type : Number,
            required : true,
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
            required : true,
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
    reviews : [{
            type : Schema.Types.ObjectId,
            ref : "Review",
            required : true
    }],
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
    }],
    // used to hold the payment_intent from strip
    // which is used to capture the payment by strip
    paymentIntent : {
        type: String
    }
})

// schema pre-hooks
requestSchema.pre("validate", function(next) {
    if (this.reviews.length > 2)
        throw new Error("Can't add review : max length is 2")
    
    if (this.reviews.length == 2){
        this.reviewed = true
        this.state = "closed"
    }
    next()
})

// giving the index to the schema
requestSchema.index({ fromLocation: "2dsphere" })
requestSchema.index({ toLocation: "2dsphere" })

// check if the user is : mod/user
requestSchema.statics.addReview = async function (reqId, user, {comment, rate}) {
    try {
        if (!comment || !rate)
            throw new Error("Can't add review : missing comment/rate")

        const req = await this.findOne({id : reqId})

        if (! req)
            throw new Error("Request not found")

        const { mod, state, reviews} = req

        if (! mod || state != "fulfilled")
            throw new Error("Request isn't fulfilled yet !!!")
        
        const revDetails = await Review.getReviewDetails(reviews)

        let reviewerId = revDetails.find(rev => {
            return rev.reviewerId.equals(user._id)
        })

        // check if the user is User/MOD
        // it's a mod
        if (mod.equals(user._id) && !reviewerId){

            // create the review
            const modReview = new Review({
                reviewerId : user._id,
                toWhom : req.userId,
                requestId : req._id,
                title : req.title,
                body : comment,
                rate : rate,
                flow : "user"
            })

            await modReview.save()

            // add to the request
            reviews.push(modReview._id)

            await req.save()

        }else if (req.userId.equals(user._id) && !reviewerId) {
            const userReview = new Review({
                reviewerId : user._id,
                toWhom : mod,
                requestId : req._id,
                title : req.title,
                body : comment,
                rate : rate,
                flow : "customer"
            })

            await userReview.save()
            reviews.push(userReview._id)
            await req.save()
        }else{
            throw new Error("Can't add review to this request : already added or not authorized")
        }
        
    } catch (e) {
        throw new Error(e.message)
    }
}
// update both the to/from location or just one
requestSchema.statics.updateRequestLocations = async function(reqId, {toLocation, fromLocation}) {

    try {

        if (!toLocation && !fromLocation)
            throw new Error("Can't update Location : empty body")

        const req = await this.findOne({id : reqId})

        // check if you can safely update the request
        if (req.state != "on")
            // TODO : throw the status code with the Error
            throw new Error("Can't edit a closed/fulfilled request")

        if (toLocation?.length == 2)
            req.toLocation.coordinates = toLocation.coordinates

        if (fromLocation?.length == 2)
            req.toLocation.coordinates = fromLocation.coordinates

        // saving
        await req.save()
       
    } catch (e) {
        throw new Error(e.message)
    }
}

// get all requests by locations
// update both the to/from location or just one
requestSchema.statics.getRequestLocations = async function(toAddress, fromAddress) {
    try {

        // check if it's undefined -> replace with empty string 
        toAddress = toAddress || ""
        fromAddress = fromAddress || ""

        const requests = await Request.find({
            toAddress : { "$regex": toAddress, "$options": "i" },
            fromAddress : { "$regex": fromAddress, "$options": "i" },
        })

        return requests
        
    } catch (e) {
        throw new Error(e.message)
    }
}

// get the requests i have to do as a MOD
requestSchema.statics.getMyRequests = async function(userId) {
    try {

        // find the user in the comments
        const reqs = await this.aggregate([
            {
                $match : {
                    mod: userId,
                    state: { $in : ["fulfilled", "closed"] }
                }
            },
            {
                $lookup : {
                    from: "comments",
                    localField: "mod", 
                    foreignField: "userId",
                    as : "comment"
                }
            },
            {
                $project: {
                    mod: true, 
                    title: true,
                    toAddress: true,
                    fromAddress: true,
                    reviewed: true,
                    state: true,
                    "comment.price": true,
                    "comment.time": true
                }
            },
            {
                $unwind: "$comment"
            }
        ])

        return reqs
        
    } catch (e) {
        throw new Error(e.message)
    }
}

// Get the verfication secret from the comment
// Only the mod can get it
requestSchema.statics.getVerifyToken = async function(userId, reqId) {
    let err = new Error()

    // get the request
    const request = await Request.findById(reqId)

    if (! request.mod){
        err.code = 400
        err.message = "Request doesn't have any MOD"
        throw err
    }

    if (! request.mod.equals(userId)){
        err.code = 401
        err.message = "Can't access this secret LoL"
        throw err
    }

    const commentInRequst = request.participants.find(comment => {
        return comment.userId.equals(userId)
    })

    const comment = await Comment.findById(commentInRequst.commentId)

    return comment?.verify_secret

}
const Request = mongoose.model('Request', requestSchema)

module.exports = Request