import locationService from './location.service'
import resp from '../../helpers/responseTemplate'
import error from '../../helpers/error'
import success from '../../helpers/success'

const setRequestLocation = async (req, res) => {
    try {

        const locations = req.body
        const requestId = req.params.reqId

        // the user to send
        if (!locations.toLocation && !locations.fromLocation)
            throw new error.ServerError(error.invalid.required("To/From Location"), 400)

        await locationService.updateRequestLocation(user, requestId, locations)

        res.send(resp(true, success.location.added, ""))

    } catch (e) {
        res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}


export default {
    setRequestLocation,
}