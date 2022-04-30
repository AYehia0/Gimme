import User from '../models/User'
import admin from 'firebase-admin'
import serviceAccount from '../config/keys/fcm.json'
import Notification from '../models/Notification'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

// send a notification to one device
// message should contain the token
// https://firebase.google.com/docs/cloud-messaging/send-message
const pushNotificationToOne = (token, message) => {

    admin.messaging().sendToDevice(token, message)
    .then(res => {
        console.log(`Success : Message has been sent ${res}`)
    })
    .catch(e => {
        console.log(`Failed : Can't send message ${e.message}`)
    })
}

// push notification to all
// exactly the same but it fetches all the users in the database and maps their tokens
const pushNotificationToMulti = async (data) => {

    // getting all the tokens 
    const users = await Notification.find()
    const tokens = users.map(user => {
        return user.notification_token
    })

    admin.messaging().sendToDevice(tokens, data)
    .then((res) => {
        console.log(res)
    }).catch(e => {
        console.log(e.message)
    })
}

// using the fcm dry run to verify the token
const verifyFcmRegToken = (fcmToken) => {
    return admin.messaging().send({
        token: fcmToken
    }, true)
}

export default {
    pushNotificationToOne,
    pushNotificationToMulti, 
    verifyFcmRegToken
}