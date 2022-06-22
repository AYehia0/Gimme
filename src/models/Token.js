import mongoose from 'mongoose'
const Schema = mongoose.Schema

const tokenSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
	token : {
		type : String,
		required : true
	},
	// TODO: add different expire time based on the tokenType
	tokenType : {
		type : String,
		// type is used to identify which is which
		// two types of tokens, 
		//		password : for password reset verification code
		//		verify : used for email verification
		enum : ["verify", "password"],
		required : true
	},
	expireAt : {
		type : Date, 
		expires : process.env.VERIFIY_TOKEN_EXPIRE,
		default : Date.now,
	}
})

const Token = mongoose.model("Token", tokenSchema)

export default Token
