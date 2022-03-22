const jwt = require('jsonwebtoken')
const User = require('../models/User')

const userAuth = async (req, res, next) => {
  try {

    // getting the token
    // checking if the token exists under the authorization header
    const authHeader = req.header('Authorization')

    if (!authHeader)
      throw new Error("Authorization header isn't set properly")

    const token = authHeader.replace("Bearer ", "")

    // validation
    const isValidToken = jwt.verify(token, process.env.JWT_TOKEN)

    const userId = isValidToken._id

    const user = await User.findOne({_id: userId, token: token})

    if (!user)
      throw new Error("User not found or Token has been expired")

    // setting new req
    req.user = user
    req.token = token


    // forwarding
    next()

  } catch (e) {
    const msg = e.message.includes('invalid signature') ? "Invalid Token LOL" : e.message
    res.send({
      status: false,
      message: msg,
      data: ""
    })
    
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
      throw new Error("Token isn't set properly in the socket")

    // validation
    const isValidToken = jwt.verify(token, process.env.JWT_TOKEN)

    const userId = isValidToken._id

    const user = await User.findOne({_id: userId, token: token}).select("-password -phone")

    if (!user)
      throw new Error("User not found or Token has been expired")

    // setting user in the socket
    socket.user = user

    // forwarding
    next()

  } catch (e) {
    next(new Error(e.message))
  }
}

module.exports = {
  userAuth,
  socketAuth
}
