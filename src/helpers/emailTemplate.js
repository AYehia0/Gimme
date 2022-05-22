export default (user, token) => {
  var mailOptions = {
    from: "no-reply@example.com",
    to: user.email,
    subject: "Account Verification Link",
    text: `Hello ${user.name}, \n\nPlease verify your account by clicking this like:\n\nhttp://${process.env.HOST_DEV}:${process.env.PORT}/confirm?userId=${user._id}&token=${token}\n\nThank You :D`
  }

  return mailOptions
}
