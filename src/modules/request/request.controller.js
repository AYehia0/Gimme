import requestServices from './request.service'
import resp from '../../helpers/responseTemplate'
import success from '../../helpers/success'
import error from '../../helpers/error'

// create a new request
const openRequest = async (req, res) => {
    try {

        const request = await requestServices.createRequest(req.user, req.body)

        res.send(resp(true, success.request.added, request))

    } catch (e) {
        let message = e.message
        let statusCode = 400
        if (message.includes("Can't extract geo keys"))
            message = error.invalid.location 

        if (message.includes("Request validation failed"))
            message = error.invalid.missing
        
        res.status(statusCode).send(resp(false, message, ""))
    }
}

// edit a request
// you can edit the title, body, locations, price and date 
// under one contition, the mod isn't choosen
const editRequest = async (req, res) => {
    let statusCode = 400
    try {
        await requestServices.editRequest(req.user, req.params.reqId, req.body)

        res.send(resp(true, success.request.edit))

    } catch (e) {
        let message = e.message
        if (message.includes('Cast to ObjectId failed')){
            e.code = statusCode
            message = error.invalid.id
        }

        if (message.includes("Can't extract geo keys")){
            e.code = statusCode
            message = error.invalid.location
        }
        
        res.status(e.code || statusCode).send(resp(false, message, ""))
    }
}

// delete a request : can't delete a request if the state is not closed
const deleteRequest = async (req, res) => {
    try {
        await requestServices.deleteReuest(req.user, req.params.reqId)

        res.send(resp(true, success.request.delete, ""))

    } catch (e) {
        res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}

// get request by location (to/from)
const searchRequests = async (req, res) => {
    let statusCode = 400
    try {

        const requests = await requestServices.searchRequestsByLocation(req.query.to, req.query.from)

        res.send(resp(true, "", requests))

    } catch (e) {
        let message = e.message
        if (message.includes("Cast to ObjectId failed")){
            statusCode = 400
            message = error.invalid.id
        }
        res.status(statusCode).send(resp(true, message, ""))
    }
}

// /requests?id=
// my all requests or certain request
// the expected query is : 
// { reqId : "requestID", userId : "userid" }
const getRequests = async (req, res) => {
    try {

        const requests = await requestServices.getRequestsByID(req.user._id, req.query)

        res.send(resp(true, "", requests))

    } catch (e) {
        res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}

// get my jobs
const getSubscibedRequests = async (req, res) => {
    try {
        const requests = await requestServices.getRequestsForMOD(req.user._id)
        res.send(resp(true, "", requests))

    } catch (e) {
        res.status(400).send(resp(false, e.message, ""))
    }
}



export default {
    openRequest,
    editRequest,
    deleteRequest,
    searchRequests,
    getRequests,
    getSubscibedRequests
}