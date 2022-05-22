// the user services handle all the bussiness logic
import User from '../../models/User'
import Token from '../../models/Token'
import error from '../../helpers/error'
import userValidation from './user.validation'
import mailer from "../../utils/email"
import crypto from "crypto"
import globalValidation from "../../helpers/validation"


const createAccount = async (data) => {

    // checks if userInfo is valid object
    const registerationData = userValidation.validateRegisteration(data)

    const user = new User(registerationData)
    
    // saving
    await user.save()
	// only for tesing
    return user
}

const generateVerificationToken = async (user) => {

	// check if the token exists
	let token = await Token.findOne({userId: user._id})

	// token doesn't exist maybe expired
	if (!token) {
		const generated = crypto.randomBytes(16).toString('hex')
		token = new Token({
			userId : user._id,
			token : generated
		})
		await token.save()
	}
	
	return token
}

const sendEmail = async (emailBody) => {

	await mailer.sendMail(emailBody)
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
const reSendVerificationToken = async (email) => {

	// find by email
	const user = await User.findOne({email: email})

	if (!user || user.isVerified){
		//throw new error.ServerError(error.user.notFound, 404)
		//throw new error.ServerError(error.user.verified, 405)
		
		// better not to expose anything to the end user
		return
	}

	// send email to that user
	const token = await generateVerificationToken(user)
	const mailOpts = emailVerificationTemplate(user, token)

	await sendEmail(mailOpts)
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

export default {
    createAccount,
    getLoginToken,
    getOthersProfile,
    editUserProfile,
    addProfilePicture,
    logoutUser,
	generateVerificationToken,
	sendEmail,
	verifyUser, 
	reSendVerificationToken
}
