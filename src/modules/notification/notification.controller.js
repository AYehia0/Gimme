import error from "../../helpers/error"
import resp from "../../helpers/responseTemplate"
import success from "../../helpers/success"
import notificationService from "./notification.service"

// adding the token to the db
const updateUserToken = async (req, res) => {
    try {
        const notificationToken = req.body.token

        if (! notificationToken)
            throw new error.ServerError(error.invalid.required("Notification Token"))

        await notificationService.updateNotificationToken(req.user, notificationService)

        res.send(resp(true, success.notification.updated, ""))
        
    } catch (e) {
        res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}

export default {
    updateUserToken
}
