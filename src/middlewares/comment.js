// middleware to check if the user in the comments so that a user can choose
// or maybe
const Request = require('../models/Request')

const isCommented = async (req, res, next) => {
  try {

    // check the requestID
    const reqId = req.query.reqId || req.params.id
    const request = await Request.findById(reqId)

    if (! request)
      throw new Error("Request not found")
    
    const userCommentedInd = request.participants.findIndex((comment) => {
        return comment.userId.equals(userId)
    })

    if (userCommentedInd == -1) 
        throw new Error("Comment doesn't exist")
      
    next()

  } catch (e) {
    let msg = e.message
    res.send({
      status: false,
      message: msg,
      data: ""
    })
  }
}

module.exports = {
  isCommented 
}