// the main functions that handle the actuall backend
const User = require('../models/User')

const registerUser = async (req, res) => {

  try {
    // getting the registeration info from the body of the request
    const userInfo = req.body

    const newUser = User(userInfo)

    // saving to the db
    await newUser.save()

    // informing the user
    res.status(200).send({
      status : true,
      message : "Success : User registered !!!",
      data : userInfo
    })
    
  } catch (e) {
    let message = e.message.includes('E11000') ? "Email Already Exists" : e.message
    res.send({
      status: false,
      message: message,
      data: ""
    })
  }
}

module.exports = {
  registerUser
}
