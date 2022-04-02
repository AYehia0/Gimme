const Request = require('../models/Request')
const Comment = require('../models/Comment')
const User = require('../models/User')

// create a new request
const openRequest = async (req, res) => {
    try {
        // the user who create the request
        const user = req.user

        // request body to be added
        const reqBody = req.body

        // TODO : probably need to change this idk
        const empReq = Request({
            userId : user._id,
            ...reqBody 
        })

        // saving
        await empReq.save()

        res.send({
            status: true,
            message: "Request has been created !!!",
            data: empReq
        })

    } catch (e) {
        let message = e.message
        let statusCode = 400
        if (message.includes("Can't extract geo keys"))
            message = "Invalid Syntax : Invalid location format"

        if (message.includes("Request validation failed"))
            message = "Invalid Syntax : There are some missing fields"
        
        res.status(statusCode).send({
            status: false,
            message: message,
            data: empReq
        })
    }
}

// edit a request
// you can edit the title, body, locations, price and date 
// under one contition, the mod isn't choosen
const editRequest = async (req, res) => {
    let statusCode = 400
    try {
        const user = req.user
        const reqId = req.params.id

        // finding the request
        // TODO : check the request status aka state
        const checkReq = await Request.findById(reqId)

        if (! checkReq){
            statusCode = 404
            throw new Error("Corrupted ID or Request not found")
        }

        if (!checkReq.userId.equals(user._id)){
            statusCode = 403
            throw new Error("Can't perform this action !!!")
        }

        if (checkReq.state != "on"){
            statusCode = 403
            throw new Error("Can't edit a closed/fulfilled request")
        }

        // TODO : updating the request fails if the geoJSON 
        await Request.findByIdAndUpdate(reqId, req.body)

        // edit it 
        res.send({
            status: true,
            message: "Success : request has been edited !!!",
            data: req.body
        })
    } catch (e) {
        let message = e.message
        if (message.includes('Cast to ObjectId failed'))
            message = "Invalid ID"
        res.status(statusCode).send({
            status: false,
            message: message,
            data: ""
        })
    }
}

// delete a request : can't delete a request if the state is not closed
// TODO : edit
const deleteRequest = async (req, res) => {
    let statusCode = 400
    try {
        const user = req.user
        const reqId = req.params.id

        // finding the request
        const requestToDel = await Request.findById(reqId)

        if (! requestToDel){
            statusCode = 404
            throw new Error("Corrupted ID or Request not found")
        }
        
        if (!requestToDel.userId.equals(user._id)){
            statusCode = 403
            throw new Error("Can't perform this action !!!")
        }

        if (requestToDel.state != "closed"){
            statusCode = 403
            throw new Error("Can't delete : must be closed")
        }

        // delete all the comments : oh boi
        const commentIDs = requestToDel.participants.map(part => {
            return part.commentId
        })

        await Comment.deleteMany({commentId : commentIDs})

        // delete the actual request
        await Request.deleteOne({_id : reqId})

        res.send({
            status: true,
            message: "Success : request has been deleted !!!",
            data: ""
        })
    } catch (e) {
        let message = e.message
        res.status(statusCode).send({
            status: false,
            message: message,
            data: ""
        })
    }
}

// close a request
// by choosing the MOD
const closeRequest = async (req, res) => {
    let statusCode = 400
    try {
        const user = req.user

        // the request id 
        const reqId = req.query.reqId

        // the id of the choosen one
        const userChoosen = req.query.modId

        // check if the request is valid : auth + didn't expire
        const checkRequest = await Request.findById(reqId)

        if (!checkRequest.userId.equals(user._id)){
            statusCode = 403
            throw new Error("Can't perform this action !!!")
        }

        if (!checkRequest){
            statusCode = 404
            throw new Error("Request doesn't exist, are you sure it exists ?")
        }
        
        if (checkRequest.state !== "on"){
            statusCode = 409
            throw new Error("It's already closed, fulfilled or deleted !!!")
        }
        
        // user exists : LOL
        const modInDB = await User.findById(userChoosen) 
        if (! modInDB)
            throw new Error("User not found")
        
        // check if the mod is one of the comments
        const userChoosenInd = checkRequest.participants.findIndex((comment) => {
            return comment.userId.equals(userChoosen)
        })
        if (userChoosenInd == -1)
            throw new Error("User not found in comments")

        // make it MOD
        checkRequest.mod = userChoosen

        // change the state of the request to fulfilled
        checkRequest.state = "fulfilled" 

        // change the comment of the user as MOD : true
        await Comment.findByIdAndUpdate(checkRequest.participants[userChoosenInd].commentId, {
            mod : true
        })

        await checkRequest.save()

        res.send({
            status: true,
            message: "MOD has been choosen",
            data: checkRequest
        })
    
        // TODO : send to the other part to verify
        
    } catch (e) {
        let message = e.message
        if (message.includes('Cast to ObjectId failed'))
            message = "Corrupted ID : Check the ID for both the request and the MOD"
        res.status(statusCode).send({
            status: false,
            message: message,
            data: ""
        })
    }
}

module.exports = {
   openRequest,
   closeRequest,
   editRequest,
   deleteRequest 
}