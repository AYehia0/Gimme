import nodemailer from 'nodemailer'

// default config settings
let mailConfig = {
		host: 'smtp.exmaple.email',
		port: 587,
		auth: {
			user: "",
			pass: "" 
		}
    }

if (process.env.NODE_ENV === 'production' ){
	// real mail server goes here
	// ...

} else {
    // all emails are catched by ethereal.email
    mailConfig = {
		host: 'smtp.ethereal.email',
		port: 587,
		auth: {
			user: process.env.SMTP_EMAIL,
			pass: process.env.SMTP_PASS,
		}
    }
}

const transporter = nodemailer.createTransport(mailConfig)

export default transporter
