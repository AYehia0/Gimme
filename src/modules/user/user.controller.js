// getting the services
import userServices from './user.service'
import resp from '../../helpers/responseTemplate'
import success from '../../helpers/success'
import error from '../../helpers/error'
import uploader from '../../middlewares/uploader'
import emailVerificationTemplate from '../../helpers/emailTemplate'
import {ZodError} from 'zod'

const registerUser = async (req, res) => {
  try {

    const userAccount = await userServices.createAccount(req.body)
	  
	  const userAccountToken = await userServices.generateVerificationToken(userAccount)
	
	  const mailOpts = emailVerificationTemplate(userAccount, userAccountToken)
	
	  await userServices.sendEmail(mailOpts)

    res.send(resp(true, success.register, "")) 

  } catch (e) {

    if (e.message.includes("E11000")) {
      e.message = error.user.registered
      e.code = 409
    }
    if (e instanceof ZodError)
      return res.status(e.code || 400).send(resp(false, e.flatten(), ""))
    
    return res.status(e.code || 400).send(resp(false, e.message, ""))
  }
}

// registeration token verification
// by userId and token
const verifyUser = async (req, res) => {
  try {
	
	await userServices.verifyUser(req.query)
	res.send(resp(true, success.verified, ""))
  } catch (e) {
    if (e instanceof ZodError)
      return res.status(e.code || 400).send(resp(false, e.flatten(), ""))

    res.status(e.code || 400).send(resp(false, e.message, ""))
  }
}

// by email lol
const resendVerification = async (req, res) => {
  try {
	
	await userServices.reSendVerificationToken(req.body)
	  
	res.send(resp(true, success.verificationSent, ""))
  } catch (e) {
    if (e instanceof ZodError)
      return res.status(e.code || 400).send(resp(false, e.flatten(), ""))

	// this shouldn't return info about the users
    res.status(500).send(resp(false, e.message, ""))
  }
}

// return the token to the user
// TODO: login by phone number instead of email
const loginUser = async (req, res) => {
  try {
    
    const token = await userServices.getLoginToken(req.body)

    res.send(resp(true, success.login, token))
  } catch (e) {
    if (e instanceof ZodError)
      return res.status(e.code || 400).send(resp(false, e.flatten(), ""))

    res.status(e.code || 400).send(resp(false, e.message, ""))
  }
}

// can be used to show /me or others like /someone
// depends on what can a user see from others
// but login is required
const getMyProfile = async (req, res) => {
  try {

    res.send(resp(true, "", req.user))

  } catch (e) {

     res.send(resp(false, error.user.login, ""))

  }
}

// it can also be used as /me
const getUserProfile = async (req, res) => {
  try {

    const user = await userServices.getOthersProfile(req.params)

    res.send(resp(true, "", user))

  } catch (e) {
    if (e instanceof ZodError)
      return res.status(e.code || 400).send(resp(false, e.flatten(), ""))

     res.status(404).send(resp(false, error.user.notFound, ""))
  }
}
const logoutUser = async (req, res) => {
  try {
    
    // remove the token
    // ToDo : no need to check if the user in the headers ?
    await userServices.logoutUser(req.user)

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
    if (e instanceof ZodError)
      return res.status(e.code || 400).send(resp(false, e.flatten(), ""))

    res.status(400).send(resp(false, e.message, ""))
  }
}

// upload a profile img
const changeProfilePicture = async (req, res) => {

  // passing the profile dir as a string 
  req.dirType = process.env.UPLOAD_LOC_PROFILE

  uploader.single('image')(req, res, async (err) => {
    try {

      if (err?.code === 'LIMIT_FILE_SIZE')
        throw new error.ServerError(error.invalid.fileSize, 403)

      if (err?.message === "INV_TYPE"){
        throw new error.ServerError(error.invalid.fileType, 403)
      }

      const img = req.file?.filename

      if (!img)
        throw new error.ServerError(error.invalid.required("filename"), 400)

      await userServices.addProfilePicture(req.user, img)

      res.send(resp(true, success.uploadImg, ""))
    }
	catch(e) {
      res.status(e.code || 400).send(resp(false, e.message, ""))
    }
  })
}
export default {
	registerUser,
	loginUser,
	getMyProfile,
	getUserProfile,
	logoutUser,
	editUser,
	changeProfilePicture,
	verifyUser, 
	resendVerification
}