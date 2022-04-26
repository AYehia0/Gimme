import notificationValidation from "./notification.validation"


const updateNotificationToken = async (user, data) => {

    const {token} = notificationValidation(data)

    // updating the token to the db
    user.notification = token

    // saving
    await user.save()

}

export default {
    updateNotificationToken
}