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
      data : "" 
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

    if (!email || !password)
      throw new Error("Invalid Syntax : Email and Password are required!")

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
const getMyProfile = async (req, res) => {
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

// it can also be used as /me
const getUserProfile = async (req, res) => {
  try {

    // get the user id 
    const userId = req.params.id

    // probably it's a good idea not to throw an error 
    // and instead retrun the logged in user
    if (! userId)
      throw new Error("Invalid syntax : UserId is required")
    
    const user = await User.findById(userId).select('name -_id isTrusted createTime')
    
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
// remove the token
const logoutUser = async () => {
  try {
    
    const user = req.user 

    if (!user)
      throw new Error("Not logged in")

    user.token = ""

    await user.save()

    res.status(200).send({
      status: true,
      message: "Success: Logged out",
      data: "" 
    })
  } catch (e) {
     res.send({
      status: false,
      message: e.message,
      data: ""
    })
  }
}

// what a user can edit : 
// name, 
const editUser = async () => {
  try {
    // edit here

    await user.save()

    res.status(200).send({
      status: true,
      message: "Success: Logged out",
      data: "" 
    })
  } catch (e) {
     res.send({
      status: false,
      message: e.message,
      data: ""
    })
  }
}
module.exports = {
  registerUser,
  loginUser,
  getMyProfile,
  getUserProfile,
  logoutUser,
  editUser,
}
