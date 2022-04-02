const User = require("../models/User")
const admin = require("firebase-admin")

const serviceAccount = require("../config/fcm.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

// send a notification to one device
// message should contain the token
// https://firebase.google.com/docs/cloud-messaging/send-message
const pushNotificationToOne = (message) => {

    if (! message.token)
        return

    getMessaging().send(message)
    .then(res => {
        console.log(`Success : Message has been sent ${res}`)
    })
    .catch(e => {
        console.log(`Failed : Can't send message ${e}`)
    })
}

// push notification to all
const pushNotificationToMulti = (message) => {

    if (! message.tokens)
        return

    getMessaging().sendMulticast(message)
    .then((response) => {
        if (response.failureCount > 0) {

            const failedTokens = [];
            response.responses.forEach((resp, idx) => {

            if (!resp.success) {
                failedTokens.push(registrationTokens[idx])
            }
        })
            console.log('List of tokens that caused failures: ' + failedTokens)
        }
  })
}

module.exports = {
    pushNotificationToOne,
    pushNotificationToMulti,
}