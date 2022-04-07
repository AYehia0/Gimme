// middleware to check if the user in the comments so that a user can choose
// or maybe
const Request = require('../models/Request')

const isCommented = async (req, res, next) => {
  let statusCode = 500
  try {

    // check the requestID
    const modId = req.query.modId

    // the params may not be needed
    const reqId = req.query.reqId || req.params.id
    const request = await Request.findById(reqId)

    if (! request){
      statusCode = 404
      throw new Error("Request not found")
    }
    
    const userCommentedInd = request.participants.findIndex((comment) => {
        return comment.userId.equals(modId)
    })

    if (userCommentedInd == -1) 
        throw new Error("User not found in comments")
      
    next()

  } catch (e) {
    let msg = e.message
    res.status(statusCode).send({
      status: false,
      message: msg,
      data: ""
    })
  }
}

module.exports = {
  isCommented 
}