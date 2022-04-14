// this is a middleware to auth users (user and MOD) to access the chat
import Room from '../models/Room'

const chatAuth = async (req, res, next) => {
  try {

    // check if the user are either mod or chatMaker
    const roomId = req.params.id
    const currentUser = req.user

    const authUsers = await Room.getUsersInChat(roomId)

    const userExists = authUsers.findIndex(user => {
      return user.equals(currentUser._id)
    })

    if (userExists === -1)
      throw new Error("Not authorized")

    // forwarding
    next()

  } catch (e) {
    const msg = e.message
    res.send({
      status: false,
      message: msg,
      data: ""
    })
    
  }
}

export default {
  chatAuth 
}
