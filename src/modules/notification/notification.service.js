

const updateNotificationToken = async (user, token) => {

    // updating the token to the db
    user.notification = token

    // saving
    await user.save()

}

export default {
    updateNotificationToken
}