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
		// FIX: Drop the table to change expire time
		expires: "1h",
		default : Date.now,
		index : true,
	}
})

const Token = mongoose.model("Token", tokenSchema)

export default Token
