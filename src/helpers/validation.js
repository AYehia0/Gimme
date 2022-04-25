import mongoose from 'mongoose'
import error from './error'
import {z} from 'zod'

const ObjectId = mongoose.Types.ObjectId

const isValidMongooseId = (id) => {

    return ObjectId.isValid(id)
}

// return the parsed requestId : as valid
const validateId = (id, path) => {

    return z.string().nonempty({message: "Can't be empty"}).refine((value) => isValidMongooseId(value), {
           message : error.invalid.invalidId,
           path: [`${path}`],
        }
    ).parse(id)

}

export default {
    isValidMongooseId, 
    validateId
}