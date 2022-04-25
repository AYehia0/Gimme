import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId

const isValidMongooseId = (id) => {

    return ObjectId.isValid(id)
}

export default {
    isValidMongooseId
}