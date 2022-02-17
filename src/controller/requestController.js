const Request = require('../models/Request')

// create a new request
const openRequest = async (req, res) => {
    try {
        // the user who create the request
        const user = req.user

        // request body to be added
        const reqBody = req.body

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
        const message = e.message
        res.send({
            status: false,
            message: message,
            data: ""
        })
    }
}

// edit a request
// you can edit the title, body, locations, price and date 
// under one contition, the mod isn't choosen
const editRequest = async (req, res) => {
    try {
        const reqId = req.params.id

        // finding the request
        // TODO : check the request status aka state
        const checkReq = await Request.findById(reqId)

        if (! checkReq)
            throw new Error("Nothing to edit")

        if (checkReq.state != "on")
            throw new Error("Can't edit a closed/fulfilled request")

        const requestToEdit = await Request.findByIdAndUpdate(reqId, req.body)

        // edit it 
        res.send({
            status: true,
            message: "Success : request has been edited !!!",
            data: req.body
        })
    } catch (e) {
        const message = e.message
        res.send({
            status: false,
            message: message,
            data: ""
        })
    }
}

// create a new request
const deleteRequest = async (req, res) => {
    try {
        const reqId = req.params.id

        // finding the request
        const requestToDel = await Request.findByIdAndRemove(reqId)

        if (! requestToDel)
            throw new Error("Nothing to delete")

        res.send({
            status: true,
            message: "Success : request has been deleted !!!",
            data: ""
        })
    } catch (e) {
        const message = e.message
        res.send({
            status: false,
            message: message,
            data: ""
        })
    }
}

// close a request
// by choosing the MOD
const closeRequest = async (req, res) => {
    try {
        const user = req.user

        
    } catch (e) {
        const message = e.message
        res.send({
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