const router = require('express').Router()
const auth = require('../middlewares/auth.js')

// the controller
const locationCon = require('../controller/user.location')

// update locatin by reqId
router.put('/update-location/:id', auth.userAuth,  locationCon.setRequestLocation)

// exporting
module.exports = router