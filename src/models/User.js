import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import Room from '../models/Room'
import bcrypt from 'bcryptjs'
import error from '../helpers/error'


const Schema = mongoose.Schema

const userSchema = new Schema({
  name : {
    type: String,
    trim: true,
    maxlength: 50,
    required: true
  },
  age : {
    type : Number,
    min : 20,
    max : 100,
    required: true
  },
  gender : {
    type : String, 
    enum : ["male", "female"]
  },
  email : {
    type: String,
    trim: true,
    required: true,
    unique: true,
 },
  phone : {
    type: String,
    unique: true,
    //required: true,
  },
  password : {
    type: String,
    required: true,
  },
  // a user can be a normal user or delivery user
  // or both : special
  role : {
    type : String,
    enum : ["nUser", "dUser", "sUser"],
    default : "nUser"
  },
  isTrusted : {
    type : Boolean,
    default : false
  },
  isVerified : {
    type : Boolean,
    default : false
  },
  img : {
    type : String,

    // TODO : default img for users maybe ?
    default : "somethingIDK"
  },
  // TODO: change to tokens as a list so that user can login from different locations :D
  token: {
    type : String
  },
  customer_token : {
    type : String,
  },
  // important to keep track of users who recevie payments
  account_id : {
    type : String,
  },
  chats : [{
      type : Schema.Types.ObjectId,
      ref : "Room",
      required : true
  }]

}, { timestamps : {createdAt : "createTime"} })

// encrypting the password when the database commit happens
userSchema.pre('save', function(next) {

  // getting the current user
  const currentUser = this

  if (currentUser.isModified('password')){
    currentUser.password = bcrypt.hashSync(currentUser.password, parseInt(process.env.SALT))
  }

  next()
})

// login token
userSchema.statics.login = async (email, password) => {

  // finding the user
  // ToDo : login by phone number
  const user = await User.findOne({email: email})

  if (!user)
    throw new error.ServerError(error.user.notFound, 404)

  // password check
  const isValid = bcrypt.compareSync(password, user.password)

  if (!isValid)
    throw new error.ServerError(error.user.wrong, 403)

  //check if the user is verified or not 
  if (!user.isVerified)
    throw new error.ServerError(error.user.notVerified, 403)

  return user
}

// generating the token used for auth
userSchema.methods.genToken = async function () {

  // getting the current user
  const user = this

  const token = jwt.sign({_id: user._id}, process.env.JWT_TOKEN)

  user.token = token

  await user.save()

  return token
}

// [SECURITY] : removing some properties for security
userSchema.set('toJSON', {
    transform: function(doc, ret, opt) {
        delete ret['password']
        return ret
    }
})

userSchema.statics.getChats = async function (userId) {

  // getting the current user
  try {
    let chats = []

    const user = await this.findOne({_id : userId})
    chats = await Room.aggregate([
        {$match: {_id: {$in : user.chats}}},
        {$sort: {createdAt : -1}},
    ])

    return chats

  }catch(e) {
    console.log(e)
  }
}


// creating the model 
const User = mongoose.model('User', userSchema)

// exporting
export default User