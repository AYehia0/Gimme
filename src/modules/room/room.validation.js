import {z} from 'zod'
import error from '../../helpers/error'
import globalValidation from '../../helpers/validation'

const validateRoomInit = (rawData) => {

    const RoomInit = z.object({
        reqId: z.string().refine((value) => globalValidation.isValidMongooseId(value), {
            message : error.invalid.invalidId,
            path: ["reqId"]
        }),
        modId: z.string().refine((value) => globalValidation.isValidMongooseId(value), {
            message : error.invalid.invalidId,
            path: ["modId"]
        }),
    })

    return RoomInit.parse(rawData)
}

export default {
    validateRoomInit
}