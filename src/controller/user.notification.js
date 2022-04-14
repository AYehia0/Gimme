// adding the token to the db
const updateUserToken = async (req, res) => {
    let statusCode = 400
    try {
        const notificationToken = req.body.token

        if (! notificationToken){
            throw new Error("Device Token is required !!!")
        }

        const user = req.user

        // updating the token to the db
        user.notification = notificationToken

        // saving
        await user.save()

        res.status(200).send({
            status: true,
            message: "Token has been updating !!!",
            data: ""
        })
        
    } catch (e) {
        let message = e.message
        res.status(statusCode).send({
            status: false,
            message: message,
            data: ""
        })
    }
}


export default {
    updateUserToken
}
