import Request from "../../models/Request"
import error from "../../helpers/error"

// user should be the maker of the request
const updateRequestLocation = async (userId, requestId, locations) => {

    const request = await Request.findById(requestId)

    if (! request)
        throw new error.ServerError(error.request.notfound, 404)

    if (!request.userId.equals(userId))
        throw new error.ServerError(error.user.auth, 403)

    if (request.state != "on")
        throw new error.ServerError(error.request.edit, 405)

    // getting the request
    await Request.updateRequestLocations(request, locations)

}
export default {
    updateRequestLocation,
}