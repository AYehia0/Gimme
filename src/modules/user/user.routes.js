import userCont from './user.controller'
import { Router } from 'express'
import auth from '../../middlewares/auth'

let router = Router()

// register a user
router.post('/register', userCont.registerUser)

// confirm verification token sent in email
router.get('/confirm', userCont.verifyUser)

// resend verification code in case it expired
router.post('/resend-verify', userCont.resendVerification)

// login a user
router.post('/login', userCont.loginUser)

// upload a profile img
router.post('/profile-img', auth.userAuth, userCont.changeProfilePicture)

// show your profile
router.get('/me', auth.userAuth , userCont.getMyProfile)

// show other user profiles
router.get('/profile/:userId', auth.userAuth , userCont.getUserProfile)

// logout
router.get('/logout', auth.userAuth, userCont.logoutUser)

// edit profile
router.put('/edit', auth.userAuth, userCont.editUser)

// request password change
router.post('/forget-password', userCont.requestPasswordReset)

// password reset
router.post('/reset-password', userCont.resetPassword)

export default router