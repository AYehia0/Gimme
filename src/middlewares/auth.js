import User from '../models/User'
import jwt from 'jsonwebtoken'
import error from '../helpers/error'
import resp from '../helpers/responseTemplate'

const userAuth = async (req, res, next) => {
  try {

    // getting the token
    // checking if the token exists under the authorization header
    const authHeader = req.header('Authorization')

    if (!authHeader)
      throw new error.ServerError(error.user.headerToken, 400)

    const token = authHeader.replace("Bearer ", "")

    // validation
    const isValidToken = jwt.verify(token, process.env.JWT_TOKEN)

    const userId = isValidToken._id

    const user = await User.findOne({_id: userId, token: token})

    if (!user)
      throw new error.ServerError(error.user.tokenExpired, 401)

    // setting new req
    req.user = user
    req.token = token

    // forwarding
    next()

  } catch (e) {
    res.status(e.code || 401).send(resp(false, e.message, ""))
  }
}

// authenticate the socket.io
// the token should be sent from the frontend
const socketAuth = async (socket, next) => {
  try {

    // getting the token
    // the token should be passed to the headers as token : XXXX
    const token = socket.handshake.headers.token

    if (!token)
      throw new error.ServerError(error.user.headerToken, 400)

    // validation
    const isValidToken = jwt.verify(token, process.env.JWT_TOKEN)

    const userId = isValidToken._id

    const user = await User.findOne({_id: userId, token: token}).select("-password -phone")

    if (!user)
      throw new error.ServerError(error.user.tokenExpired, 401)

    // setting user in the socket
    socket.user = user

    // forwarding
    next()

  } catch (e) {
    // ToDo : change this.
    next(new Error(e.message))
  }
}

export default {
  userAuth,
  socketAuth
}