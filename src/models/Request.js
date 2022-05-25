import mongoose from 'mongoose'
import Review from './Review'
import Comment from './Comment'
import error from '../helpers/error'

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
requestSchema.statics.addReview = async function (user, request, {comment, rate}) {
    const { mod, reviews } = request

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
            toWhom : request.userId,
            requestId : request._id,
            title : request.title,
            body : comment,
            rate : rate,
            flow : "mod"
        })

        await modReview.save()

        // add to the request
        reviews.push(modReview._id)

        await request.save()

    }else if (request.userId.equals(user._id) && !reviewerId) {
        const userReview = new Review({
            reviewerId : user._id,
            toWhom : mod,
            requestId : request._id,
            title : request.title,
            body : comment,
            rate : rate,
            flow : "customer"
        })

        await userReview.save()

        reviews.push(userReview._id)

        await request.save()
    }else{
        // ToDo : move this from here
        throw new error.ServerError(error.invalid.reviewAdded, 405)
    }
}
// get all requests by locations
// update both the to/from location or just one
// ToDo : add pagination
requestSchema.statics.getRequestLocations = async function(toAddress, fromAddress) {

    const requests = await Request.find({
        toAddress : { "$regex": toAddress, "$options": "i" },
        fromAddress : { "$regex": fromAddress, "$options": "i" },
        state : "on"
    })

    return requests
}

// get the requests i have to do as a MOD
requestSchema.statics.getMyRequests = async function(userId) {

    // find the user in the comments
    const reqs = await this.aggregate([
        {
            $match : {
                mod: userId,
                state: { $in : ["fulfilled"] }
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

}

// deleting all the comments inside a request
requestSchema.statics.deleteRequest = async function (request) {

    // delete all the comments : oh boi
    const commentIDs = request.participants.map(comment => {
        return comment.commentId
    })

    await Comment.deleteMany({_id : commentIDs})

    await this.deleteOne(request._id)

}

requestSchema.methods.deleteComment = async function(commentId) {

    // un-attach from the request
    // for some reasons .filter doesn't work wtf !!!
    const commentIndex = this.participants.findIndex((comment) => {
        return comment.commentId.equals(commentId)
    })

    this.participants.splice(commentIndex, 1)

    await this.save()

    // delete the comment
    await Comment.findByIdAndDelete(commentId)

}


requestSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        // maybe later who nows ?
        // ret.id = ret._id
        delete ret.paymentIntent
        delete ret.__v
        return ret
    }
}
const Request = mongoose.model('Request', requestSchema)

export default Request