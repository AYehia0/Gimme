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
	expireAt : {
		type : Date, 
		default : Date.now,
		index : {
			expires : process.env.VERIFIY_TOKEN_EXPIRE
		}
	}
})

const Token = mongoose.model("Token", tokenSchema)

export default Token
