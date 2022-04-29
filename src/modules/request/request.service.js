import Request from '../../models/Request'
import error from '../../helpers/error'
import requestValidation from './request.validation'
import globalValidation from '../../helpers/validation'

// user can create a new request
const createRequest = async (user, data) => {

    const requestData = requestValidation.validateRequest(data)

    const request = new Request({
        userId : user._id,
        ...requestData
    })

    await request.save()

    return request
}

// user can edit only the requests he created 
// user can't edit a closed/fulfilled request
// user can't edit a request having a mod
const editRequest = async (user, id, data) => {

    const requestId = globalValidation.validateId(id, "reqId")

    const request = await Request.findById(requestId)

    if (! request) 
        throw new error.ServerError(error.request.notfound, 404)

    if (!request.userId.equals(user._id))
        throw new error.ServerError(error.user.auth, 401)

    // database can't have anything but : on, fulfilled, closed, deleted
    if (request.state != "on")
        throw new error.ServerError(error.request.edit, 405)

    const reqData = requestValidation.validateRequest(data)

    Object.entries(reqData).forEach(([key, val]) => {
        request[key] = val
    })

    await request.save()
}

// a request can't be deleted unless it's closed
// deleting a request from the database by its id
// deleting a reuqest deletes all the comments inside it
const deleteReuest = async (user, id) => {

    const requestId = globalValidation.validateId(id, "reqId")

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

const searchRequestsByLocation = async (searchQuery) => {

    const {to, from} = requestValidation.validateSearchRequest(searchQuery)

    const requests = await Request.getRequestLocations(to, from)

    return requests

}

// get single request by id : id
// get all the requests a user (current user only) opened : userId
const getRequestsByID = async (user, query) => {

    if (Object.keys(query).includes("reqId")){
        const reqId = globalValidation.validateId(query.reqId, "reqId")
        return [await Request.findById(reqId)]
    }
    return await Request.find({userId: user._id})

}

// the requests which is fulfilled only
const getRequestsForMOD = async (userId) => {

    return await Request.getMyRequests(userId)

}

// get on requests, i commented on
const getMyOnRequests = async (userId, state) => {

    const rightState = requestValidation.validateRequestState(state)
    return await Request.find({"participants.userId" : userId , state : rightState})

}



export default {
    createRequest,
    editRequest,
    deleteReuest,
    searchRequestsByLocation,
    getRequestsByID,
    getRequestsForMOD, 
    getMyOnRequests
}
