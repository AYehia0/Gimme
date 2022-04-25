import {z} from 'zod'
import error from '../../helpers/error'
import globalValidation from '../../helpers/validation'


const validateReviewCreation = (rawData) => {

    const Review = z.object({
       comment: z.string().nonempty().max(300),
       rate: z.number().int().min(1).max(5)
    })

    return Review.parse(rawData)
}

export default {
    validateReviewCreation
}