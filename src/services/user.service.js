// the user services handle all the bussiness logic
import registerValidator from '../validations/register.validation'
import User from '../models/User'

const createAccount = async (data) => {

    // checks if userInfo is valid object
    const {name, email, phone, password} = data
    const user = new User({
        name,
        email,
        phone,
        password
    })
    
    // saving
    await user.save()
}

// return the login token if success
const getLoginToken = async (data) => {
    let err = new Error()

    const {email, password} = data
    if (!email || !password){
        err.code = 400
        err.message = "Invalid Syntax : Email and Password are required!"
        throw err
    }

    const user = await User.login(email, password, 'user')

    return await user.genToken()
    
}

// can be used to show /me or others like /someone
// depends on what can a user see from others
// but login is required
const getOthersProfile = async (userId) => {

    if (! userId)
        throw new Error("Invalid syntax : UserId is required")
    
    const user = await User.findById(userId).select('name -_id isTrusted createTime')

    if (!user)
        throw new Error("User not found")

    return user
}

// what a user can edit : name and password only
const editUserProfile = async (user, data) => {

    const {name, password} = data

    if (!name || !password)
      throw new Error("Username or password are required")

    // edit 
    user.name = name
    user.password = password

    await user.save()

}

// add/update a profile img to the user
const addProfilePicture = async (user, img) => {

    if (!img)
      throw new Error("Image is required")

    user.img = `photos/${user._id}/${img}`

    await user.save()

}

export {
    createAccount,
    getLoginToken,
    getOthersProfile,
    editUserProfile,
    addProfilePicture,
}
