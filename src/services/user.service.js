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

// return the token to the user
// TODO: login by phone number instead of email
const loginUser = async (req, res) => {
}

// can be used to show /me or others like /someone
// depends on what can a user see from others
// but login is required
const getMyProfile = async (req, res) => {
}

// it can also be used as /me
const getUserProfile = async (req, res) => {
}
// remove the token
const logoutUser = async (req, res) => {
}

// what a user can edit : 
// name, 
const editUser = async (req, res) => {
}

// upload a profile img
const changeProfilePicture = async (req, res) => {
}

export {
    createAccount,
    loginUser,
    getMyProfile,
    getUserProfile,
    logoutUser,
    editUser,
    changeProfilePicture,
}
