// the user services handle all the bussiness logic
import User from '../../models/User'
import error from '../../helpers/error'
import userValidation from './user.validation'

const createAccount = async (data) => {

    // checks if userInfo is valid object
    const registerationData = userValidation.validateRegisteration(data)

    const user = new User(registerationData)
    
    // saving
    await user.save()

    // only for tesing
    return user
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
    logoutUser
}
