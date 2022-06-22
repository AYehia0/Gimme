// The basic template which is being sent to the user as email, when requesting verification
const verificationTemplate = (user, token) => {

  return {
    from: "no-reply@example.com",
    to: user.email,
    subject: "Account Verification Link",
    text: `Hello ${user.name}, \n\nPlease verify your account by clicking this link:\n\nhttp://${process.env.HOST_DEV}:${process.env.PORT}${process.env.MAIN_API}/${process.env.USER_API}/confirm?userId=${user._id}&token=${token.token}\n\nThank You :D`
  }

}

// when requesting password reset 
const passwordResetTemplate = (user, token) => {

  return {
    from: "no-reply@example.com",
    to: user.email,
    subject: "Password Reset Link",
    text: `Hello ${user.name}, \n\nUse this code to reset your password:\n\nSecret:${token.token}\n\nThank You :D`
  }

}


export default {
	verificationTemplate,
	passwordResetTemplate
}
