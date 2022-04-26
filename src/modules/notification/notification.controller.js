import { ZodError } from "zod"
import resp from "../../helpers/responseTemplate"
import success from "../../helpers/success"
import notificationService from "./notification.service"

// adding the token to the db
// ToDo : protect this route : none but the device can do this 
const updateUserToken = async (req, res) => {
    try {

        await notificationService.updateNotificationToken(req.user, req.body)

        res.send(resp(true, success.notification.updated, ""))
        
    } catch (e) {
        if (e instanceof ZodError)
            return res.status(e.code || 400).send(resp(false, e.flatten(), ""))

        res.status(e.code || 400).send(resp(false, e.message, ""))
    }
}

export default {
    updateUserToken
}
