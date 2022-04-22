import Request from '../../models/Request'
import error from '../../helpers/error'

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

    if (! requestId) 
        throw new error.ServerError(error.invalid.required("Request ID"), 400)

    const request = await Request.findById(requestId)

    if (! request) 
        throw new error.ServerError(error.request.notfound, 404)

    // database can't have anything but : on, fulfilled, closed, deleted
    if (request.state != "on")
        throw new error.ServerError(error.request.edit, 403)

    Object.entries(data).forEach(([key, val]) => {
        request[key] = val
    })

    await request.save()
}

// a request can't be deleted unless it's closed
// deleting a request from the database by its id
// deleting a reuqest deletes all the comments inside it
const deleteReuest = async (user, requestId) => {

    if (! requestId) 
        throw new error.ServerError(error.invalid.required("Request ID"), 404)

    const requestToDel = await Request.findById(requestId)

    if (! requestToDel)
        throw new error.ServerError(error.invalid.id, 404)
    
    if (!requestToDel.userId.equals(user._id))
        throw new error.ServerError(error.user.auth, 403)

    // ToDo : fix me : if the request is deleted, what happens to the review ? .. requestToDel.state != "on" 
    if (requestToDel.state === "fulfilled")
        // not allowed
        throw new error.ServerError(error.request.delete, 405)

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

        return [await Request.findById({ _id : query.reqId })]

    return await Request.find({userId: user._id})

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