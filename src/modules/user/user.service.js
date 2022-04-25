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

    const {email, password} = data

    const user = await User.login(email, password, 'user')

    return await user.genToken()
}

// can be used to show /me or others like /someone
// depends on what can a user see from others
// but login is required
const getOthersProfile = async (userId) => {

    const user = await User.findById(userId).select('name -_id isTrusted createTime')

    if (!user)
        throw new error.ServerError(error.user.notFound, 404)

    return user
}

// what a user can edit : name and password only
const editUserProfile = async (user, data) => {

    const newName = data.name
    const newPassword = data.password
    if (newName)
        user.name = newName
    
    if (newPassword)
        user.password = newPassword

    await user.save()
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
