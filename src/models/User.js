const mongoose = require('mongoose')
const validator = require('validator')
const bcrybt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Room = require('../models/Room')
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
    max : 100
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
    validate(value) {
      if (!validator.isEmail(value))
        throw new Error("Invalid Email!!!")
    }
  },
  phone : {
    type: String,
    unique: true,
    //required: true,
    validate(value) {
      if (!validator.isMobilePhone(value, ['ar-EG']))
        throw new Error("Invalid Phone Format!!!")
    }
  },
  password : {
    type: String,
    required: true,
    validate (value) {
      if (!validator.isStrongPassword(value, {
        minLength: process.env.MIN_PASS_LEN,
        maxLength: process.env.MAX_PASS_LEN
      }))
        throw new Error("Weak Password!!!")
    }
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
  img : {
    type : String,

    // TODO : default img for users maybe ?
    default : "somethingIDK"
  },
  // TODO: change to tokens as a list so that user can login from different locations :D
  token: {
    type : String
  },
  notification_token : {
    type : String,
    default : ""
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
    currentUser.password = bcrybt.hashSync(currentUser.password, parseInt(process.env.SALT))
  }

  next()
})

// login token
userSchema.statics.login = async (email, password) => {

  let error 
  // finding the user
  const user = await User.findOne({email: email})

  if (!user){

    error = new Error("User not found, are you registered ?")
    error.code = 404

    throw error
  }

  // password check
  const isValid = bcrybt.compareSync(password, user.password)

  if (!isValid){
    error = new Error("Incorrect Password/Email")
    error.code = 403
    throw error
  }

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
module.exports = User