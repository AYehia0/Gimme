const Request = require('../models/Request')
const Comment = require('../models/Comment')
const User = require('../models/User')
const notify = require('../utils/notification')

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

        // ToDo : fix me : if the request is deleted, what happens to the review ? .. requestToDel.state != "on" 
        if (requestToDel.state === "fulfilled"){
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
            message: "Request has been deleted !!!",
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
        const choosenUserId = req.query.modId

        // check if the request is valid : auth + didn't expire
        // fix : reduce this db call by removing this, since this check is in the middleware : comment.js
        const checkRequest = await Request.findById(reqId)

        if (!checkRequest.userId.equals(user._id)){
            statusCode = 403
            throw new Error("Can't perform this action !!!")
        }

        if (checkRequest.state !== "on"){
            statusCode = 409
            throw new Error("It's already closed, fulfilled or deleted !!!")
        }
        // check if the credit card is valid and contains the amount of money
        // ...

        // getting the commentId
        const comment = checkRequest.participants.find(comment => {
            return comment.userId.equals(choosenUserId)
        })

        // make it MOD
        checkRequest.mod = choosenUserId 

        // change the state of the request to fulfilled
        checkRequest.state = "fulfilled" 

        // change the comment of the user as MOD : true
        await Comment.findByIdAndUpdate(comment.commentId, {mod : true})

        await checkRequest.save()

        // TODO : send to the other part to verify
        // ToDo : send notification to the other part
        // didn't test, probably gonna fail
        const notification_msg = {
            "msg" : "Congratuation you're the choosen one :D"
        }
        if (choosenMod.notification_token)
            notify.pushNotificationToOne(choosenMod.notification_token, notification_msg)

        res.send({
            status: true,
            message: "MOD has been choosen",
            data: checkRequest
        })
        
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

// ToDo : release the payment

// get request by location (to/from)
const searchRequests = async (req, res) => {
    let statusCode = 400
    try {

        // get the locations
        const to = req.query.to
        const from = req.query.from

        const requests = await Request.getRequestLocations(to, from)

        res.send({
            status: true,
            message: "",
            data: requests
        })
    } catch (e) {
        let message = e.message
        if (message.includes("Cast to ObjectId failed")){
            statusCode = 400
            message = "Invalid ID"
        }
        res.status(statusCode).send({
            status: false,
            message: message,
            data: ""
        })
    }
}

// /requests?id=
// my all requests or certain request
const getRequests = async (req, res) => {
    let statusCode = 200
    try {

        let requests = []
        const requestId = req.query.id
        const userId = req.user._id

        if (requestId)
            requests = [await Request.findById(requestId)]
        else
            requests = await Request.find({userId})

        res.status(statusCode).send({
            status: true,
            msessage: "",
            data: requests || []
        })
    } catch (e) {
        let message = e.message

        if (message.includes("Cast to ObjectId failed")){
            statusCode = 400
            message = "Invalid ID"
        }
        res.status(statusCode).send({
            status: false,
            message: message,
            data: ""
        })
    }
}

// get my jobs
const getSubscibedRequests = async (req, res) => {
    let statusCode = 200
    try {

        const userId = req.user._id

        const requests = await Request.getMyRequests(userId)

        res.status(statusCode).send({
            status: true,
            msessage: "",
            data: requests || []
        })
    } catch (e) {
        let message = e.message

        if (message.includes("Cast to ObjectId failed")){
            statusCode = 400
            message = "Invalid ID"
        }
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
    deleteRequest,
    searchRequests,
    getRequests,
    getSubscibedRequests
}