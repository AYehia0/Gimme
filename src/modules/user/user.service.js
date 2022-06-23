// the user services handle all the bussiness logic
import User from '../../models/User'
import Token from '../../models/Token'
import error from '../../helpers/error'
import userValidation from './user.validation'
import mailer from "../../utils/email"
import crypto from "crypto"
import globalValidation from "../../helpers/validation"
import emailTemps from "../../helpers/emailTemplate"


const createAccount = async (data) => {

    // checks if userInfo is valid object
    const registerationData = userValidation.validateRegisteration(data)

    const user = new User(registerationData)
    
    // saving
    await user.save()

    return user
}

const generateVerificationToken = async (user, type) => {

	// check if the token exists
	// FIX: it returns the token with the old expire time
	let token = await Token.findOne({
		userId: user._id,
		tokenType : type
	})

	// token doesn't exist maybe expired
	if (!token) {
		const generated = crypto.randomBytes(16).toString('hex')
		token = new Token({
			userId : user._id,
			token : generated,
			tokenType : type
		})
		await token.save()
	}
	
	return token
}

// verification by userId and token
const verifyUser = async (userData) => {

	const {userId, token} = userData

    const id = globalValidation.validateId(userId, "userId")

	const user = await User.findById(id)

	if (!user)
		throw new error.ServerError(error.user.notFound, 404)

	// check if user is already verified
	if (user.isVerified)
		throw new error.ServerError(error.user.verified, 405)

	// check the token
	const dbToken = await Token({userId : id, token: token})

	if (!dbToken)
		throw new error.ServerError(error.invalid.verificationToken, 403)

	user.isVerified = true
	await user.save()

	// delete the token
	// not the best way to do, but man i hate this shit, mongoose is trash lol
	await Token.findOneAndRemove({_id : dbToken._id})
}
const sendVerificationToken = async (user, regNow=false) => {

	// find by email
	if (!regNow) {
		user = await User.findOne({email: user.email})

		if (!user || user.isVerified){
			//throw new error.ServerError(error.user.notFound, 404)
			//throw new error.ServerError(error.user.verified, 405)
			
			// better not to expose anything to the end user
			return
		}
	}

	// send email to that user
	const token = await generateVerificationToken(user, "verify")
	const mailOpts = emailTemps.verificationTemplate(user, token)

	await mailer.sendMail(mailOpts)
}

// return the login token if success
const getLoginToken = async (data) => {

    const loginData = userValidation.validateLogin(data)

    const user = await User.login(loginData.email, loginData.password)

    return await user.genToken()
}

// can be used to show /me or others like /someone
// depends on what can a user see from others
// but login is required
const getOthersProfile = async (data) => {

    const userId = userValidation.validateUserId(data).userId
	// TODO: update this, remove tokens and other shit
    const user = await User.findById(userId).select('name -_id isTrusted createTime age gender')

    if (!user)
        throw new error.ServerError(error.user.notFound, 404)

    return user
}

// what a user can edit : name and password only
const editUserProfile = async (user, editData) => {

    const data = userValidation.validateEditProfile(editData)

    // not the best thing to do, but meh I wanna sleep :(
    if (Object.keys(data).length !== 0) {
        for (const [key, value] of Object.entries(data)) {
            user[`${key}`] = value
        }
        await user.save()
    }
    return user
}

// add/update a profile img to the user
const addProfilePicture = async (user, img) => {

    user.img = `photos/${user._id}/${process.env.UPLOAD_LOC_PROFILE}/${img}`

    await user.save()

}

const logoutUser = async (user) => {

    user.token = ""
    await user.save()
}

// password reset
const changePasswordNoAuth = async (dataRaw) => {

	// validations 
	const passwordData = userValidation.passwordReset(dataRaw)

	// get the code
	// FIX: What are the odds to find two equal tokens at the same time ?
	const verifyToken = await Token.findOne({
		token : passwordData.secret,
		tokenType: "password"
	})
	// verify the code
	if (!verifyToken)
		throw new error.ServerError(error.invalid.verificationToken, 403)

	// TODO: add a function to validate the password in the user.validation.js, and make sure to use this function in the updateProfile validation
	// change the password
	await User.findByIdAndUpdate(verifyToken.userId, {
		password : passwordData.password
	})

	// delete the token
	// FIX: find a better way to delete token, maybe by setting the expire time to '0' idk
	await Token.deleteOne({_id : verifyToken._id})

}

const forgotPassword = async (bodyData) => {

	// send password reset code to that email
	const email = userValidation.validateUserEmail(bodyData)

	// check if the user exists
	const user = await User.findOne({
		email: email.email
	})

	if (!user)
		return

	// TODO: check if there is a token exists for that email
	let passwordResetToken 
	passwordResetToken = await Token.findOne({
		userId : user._id,
		tokenType : "password"
	})
	
	// create a token for that id
	if (!passwordResetToken) {
		const genPasswordToken = crypto.randomBytes(16).toString('hex')
		passwordResetToken = new Token({
			userId : user._id,
			// TODO : make a function in helper to generate random tokens
			token : genPasswordToken,
			tokenType : "password"
		})

		// save the token
		await passwordResetToken.save()
	}
	// send email to the user
	// TODO: should I send the user again if sent already ?
	const emailConf = emailTemps.passwordResetTemplate(user, passwordResetToken)
	// TODO: again make a hook for this
	await mailer.sendMail(emailConf)

}

export default {
    createAccount,
    getLoginToken,
    getOthersProfile,
    editUserProfile,
    addProfilePicture,
    logoutUser,
	forgotPassword,
	changePasswordNoAuth,
	sendVerificationToken,
	verifyUser,
	generateVerificationToken
}
