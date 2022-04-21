import locationCon from './location.controller'
import { Router } from 'express'
import auth from '../../middlewares/auth'

let router = Router()

// update locatin by reqId
router.put('/update-location/:id', auth.userAuth,  locationCon.setRequestLocation)

// exporting
export default router