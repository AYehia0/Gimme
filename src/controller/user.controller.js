// getting the services
import *  as userServices from '../services/user.service'
import resp from '../helpers/responseTemplate'
import success from '../helpers/success'
import error from '../helpers/error'

const registerUser = async (req, res) => {
  let message
  let statusCode = 400
  try {

    await userServices.createAccount(req.body)

    res.send(resp(true, success.register, "")) 

  } catch (e) {

    if (e.message.includes("E11000")) {
      message = "Email/Phone Already Exists"
      statusCode = 409
    }
    res.status(400).send(resp(false, message, ""))
  }
}

// return the token to the user
// TODO: login by phone number instead of email
const loginUser = async (req, res) => {
  let message
  let statusCode = 200
  try {
    
    // get the username and the password
    const token = await userServices.getLoginToken(req.body)

    res.send(resp(true, success.login, token))
  } catch (e) {
    message = e.message

    if (message === "User not found, are you registered ?" || message === "Incorrect Password/Email"){
      statusCode = e.code
    }
    res.status(statusCode).send(resp(false, message, ""))
  }
}

// can be used to show /me or others like /someone
// depends on what can a user see from others
// but login is required
const getMyProfile = async (req, res) => {
  try {

    res.send(resp(true, "", req.user))

  } catch (e) {

     res.send(resp(false, error.login, ""))

  }
}

// it can also be used as /me
const getUserProfile = async (req, res) => {
  try {

    const user = await userServices.getOthersProfile(req.params.id)
    res.send(resp(true, "", user))

  } catch (e) {
     res.status(404).send(resp(false, error.notFound, ""))
  }
}
const logoutUser = async (req, res) => {
  try {
    
    // remove the token
    // this is possible due to mongoose saving the user pros in the json
    const user = req.user 
    user.token = ""

    await user.save()

    res.send(resp(true, success.logout, ""))
  } catch (e) {
     res.status(400).send(resp(false, e.message, ""))
  }
}

// what a user can edit : 
// name, 
const editUser = async (req, res) => {
  try {
    await userServices.editUserProfile(req.user, req.body)

    res.send(resp(true, success.edit, ""))
  } catch (e) {
     res.status(400).send(resp(false, e.message, ""))
  }
}

// upload a profile img
const changeProfilePicture = async (req, res) => {
  try {

    await userServices.addProfilePicture(req.user, req.file.filename)

    res.send(resp(true, success.uploadImg, ""))

  } catch (e) {
     res.status(400).send(resp(false, e.message, ""))
  }
}
export default {
  registerUser,
  loginUser,
  getMyProfile,
  getUserProfile,
  logoutUser,
  editUser,
  changeProfilePicture,
}