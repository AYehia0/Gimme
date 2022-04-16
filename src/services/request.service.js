import Request from '../models/Request'
import Comment from '../models/Comment'
import error from '../helpers/error'

// user can create a new request
const createRequest = async (user, data) => {

    const request = new Request({
        userId : user._id,
        ...data
    })

    await request.save()

    return request
}

// user can edit only the requests he created 
// user can't edit a closed/fulfilled request
// user can't edit a request having a mod
const editRequest = async (user, requestId, data) => {

    let err = new Error()

    if (! requestId) {
        err.code = 404
        err.message = "Request ID is required"
        throw err
    }

    const request = await Request.findById(requestId)

    if (! request) {
        err.code = 404
        err.message = error.request.notfound
        throw err
    }

    // database can't have anything but : on, fulfilled, closed, deleted
    if (request.state != "on"){
        err.code = 403
        err.message = error.request.edit
        throw err
    }

    Object.entries(data).forEach(([key, val]) => {
        request[key] = val
    })

    await request.save()
}

// a request can't be deleted unless it's closed
// deleting a request from the database by its id
// deleting a reuqest deletes all the comments inside it
const deleteReuest = async (user, requestId) => {

    let err = new Error()

    if (! requestId) {
        err.code = 404
        err.message = "Request ID is required"
        throw err
    }

    const requestToDel = await Request.findById(requestId)

    if (! requestToDel){
        err.code = 404
        err.message = error.invalid.id
        throw err
    }
    
    if (!requestToDel.userId.equals(user._id)){
        err.code = 403
        err.message = error.auth
        throw err
    }

    // ToDo : fix me : if the request is deleted, what happens to the review ? .. requestToDel.state != "on" 
    if (requestToDel.state === "fulfilled"){
        // not allowed
        err.code = 405
        err.message = error.request.delete
        throw err
    }

    await Request.deleteRequest(requestToDel)

}

const searchRequestsByLocation = async (to, from) => {

    const requests = await Request.getRequestLocations(to, from)

    return requests

}

// get single request by id : id
// get all the requests a user (current user only) opened : userId
const getRequestsByID = async (user, query) => {

    if (query.reqId)
        return [Request.findById(query.reqId)]

    return Request.find({userId: user._id})

}

// the requests which is fulfilled only
const getRequestsForMOD = async (userId) => {

    return await Request.getMyRequests(userId)

}


export default {
    createRequest,
    editRequest,
    deleteReuest,
    searchRequestsByLocation,
    getRequestsByID,
    getRequestsForMOD
}
