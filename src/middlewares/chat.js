// this is a middleware to auth users (user and MOD) to access the chat
import Room from '../models/Room'
import error from '../helpers/error'
import globalValidation from '../helpers/validation'
import { ZodError } from 'zod'
import resp from '../helpers/responseTemplate'

const chatAuth = async (req, res, next) => {
  // check if the user are either mod or chatMaker

  try {
    const roomId = globalValidation.validateId(req.body.roomId, 'roomId')

    const user = req.user

    const room = await Room.findById(roomId)

    // idk if you should add this here : single resp rules SOLID
    // ToDo : this exposes the room existance
    if (!room)
      throw new error.ServerError(error.invalid.id, 400)

    // checking if the user is authorized to perform
    if (!room.roomMaker.equals(user._id) || !room.user.equals(user._id))
      throw new error.ServerError(error.user.auth, 403)

    next()
    
  } catch (e) {
    if (e instanceof ZodError)
      return res.status(e.code || 400).send(resp(false, e.flatten(), ""))
    
    res.status(e.code || 400).send(resp(false, e.message, ""))
    
  }
}

export default {
  chatAuth 
}
