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

// return the token to the user
// TODO: login by phone number instead of email
const loginUser = async (req, res) => {
  try {
    
    // get the username and the password
    const {email, password} = req.body

    // user in db ?
    const user = await User.login(email, password, 'user')

    // get the token
    const token = await user.genToken()

    res.status(200).send({
      status: true,
      message: "Login: success",
      data: token
    })
  } catch (e) {
     res.send({
      status: false,
      message: "Can't login!!!",
      data: e.message
    })
  }
}

// can be used to show /me or others like /someone
// depends on what can a user see from others
// but login is required
const getUserProfile = async (req, res) => {
  try {
    
    const user = req.user 
    
    res.status(200).send({
      status: true,
      message: "",
      data: user
    })
  } catch (e) {
     res.send({
      status: false,
      message: "Not authorized",
      data: e.message
    })
  }
}


module.exports = {
  registerUser,
  loginUser,
  getUserProfile
}
