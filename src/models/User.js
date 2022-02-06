const mongoose = require('mongoose')
const validator = require('validator')
const bcrybt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema

const userSchema = new Schema({
  name : {
    type: String,
    trim: true,
    maxlength: 50,
    required: true
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
  // TODO: change to tokens as a list so that user can login from different locations :D
  token: {
    type: String
  },

}, { timestamps : {createdAt : "createTime"} })

// encrypting the password when the database commit happens
userSchema.pre('save', function(next) {

  // getting the current user
  const currentUser = this

  if (currentUser.isModified('password')){
    currentUser.password = bcrybt.hashSync(currentUser.password, process.env.SALT)
  }

  next()

})


// creating the model 
const User = mongoose.model('User', userSchema)

// exporting
module.exports = User
