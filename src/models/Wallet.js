import mongoose from 'mongoose'

const Schema = mongoose.Schema

// should I add the history of the transactions to the wallet ?
const userWalletSchema = new Schema({
  userId : {
    type : Schema.Types.ObjectId,
    ref : "User",
    unique : true,
    required : true
  },
  // balance in piastres
  // 1 EGP = 100 piastres 
  balance : {
    type : Number,
    default : 0
  }
})

// creating the model 
const Wallet = mongoose.model('Wallet', userWalletSchema)

// exporting
export default Wallet