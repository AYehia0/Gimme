import notificationValidation from "./notification.validation"
import notification from '../../utils/notification'
import Notification from "../../models/Notification"
import error from "../../helpers/error"

const updateNotificationToken = async (user, data) => {

    const {token} = notificationValidation(data)

    // check if the token is valid 
    notification.verifyFcmRegToken(token).then(async (result) => {

        // create a notification profile if not exist
        let update = {
            notification_token : token
        }
        let opts = {
            upsert : true,
        }
        await Notification.findOneAndUpdate({userId: user._id}, update, opts)
        
    }).catch(e => {

        throw error.ServerError(error.invalid.fcm_token, 400)

    })

}

export default {
    updateNotificationToken
}