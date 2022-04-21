import userCont from './user.controller'
import uploader from '../../middlewares/uploader'
import { Router } from 'express'
import auth from '../../middlewares/auth'

let router = Router()


// register a user
router.post('/register', userCont.registerUser)

// login a user
router.post('/login', userCont.loginUser)

// upload a profile img
router.post('/profile-img', auth.userAuth, uploader.single('image'), userCont.changeProfilePicture)

// show your profile
router.get('/me', auth.userAuth , userCont.getMyProfile)

// show other user profiles
router.get('/profile/:id', auth.userAuth , userCont.getUserProfile)

// logout
router.get('/logout', auth.userAuth, userCont.logoutUser)

export default router