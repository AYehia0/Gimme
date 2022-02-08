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

module.exports = {
  userAuth
}
