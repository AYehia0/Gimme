// this is a middleware to auth users (user and MOD) to access the chat
import Room from '../models/Room'
import error from '../helpers/error'

const chatAuth = async (req, res, next) => {
  // check if the user are either mod or chatMaker
  const roomId = req.params.roomId
  const user = req.user

  const room = await Room.findById(roomId)

  // idk if you should add this here : single resp rules SOLID
  if (!room)
    throw new error.ServerError(error.invalid.id, 400)

  // checking if the user is authorized to perform
  if (!room.roomMaker.equals(user._id) || !room.user.equals(user._id))
    throw new error.ServerError(error.user.auth, 403)

  next()
}

export default {
  chatAuth 
}
