// the validation schema using zod to verify user input
import {z} from 'zod'
import validator from 'validator'
import globalValidation from '../../helpers/validation'
import error from '../../helpers/error'

const validateRegisteration = (rawData) => {

    const Registeration = z.object({
        name: z.string().max(50),
        age: z.number().min(20).max(100).int(),
        gender: z.enum(["male", "female"]).optional(),
        email: z.string().email(),
        phone: z.string().optional().refine((value) => {
            if (process.env.NODE_ENV === "production")
                validator.isMobilePhone(value, ['ar-EG'])
            else 
                return true
        }, { message: "Make sure it's a valid phone number", path: ["phone"]} ),
        password: z.string().refine((value) => {

            if (process.env.NODE_ENV === "production")
                validator.isStrongPassword(value, {
                    minLength: process.env.MIN_PASS_LEN,
                    maxLength: process.env.MAX_PASS_LEN
                }) 
            else 
                return true
            },{ message: "make sure it's a strong password", path: ["password"] }
        ),
        // you can also pass the notification token while creating an account
        notification_token: z.string().optional()
    })

    // this may throw error
    // catch it later
    return Registeration.parse(rawData)

}

const validateLogin = (rawData) => {

    const Login = z.object({
        email: z.string().email(),
        password: z.string()
    })

    return Login.parse(rawData)

}

const validateUserId = (rawData) => {

    const UserId = z.object({
        userId: z.string().refine((value) => globalValidation.isValidMongooseId(value), {
            message: error.invalid.invalidId,
            path: ["userId"]
        }),
    })

    return UserId.parse(rawData)
}

const validateEditProfile = (rawData) => {

    const EditProfile = z.object({
        name: z.string().optional().max(50),
        password: z.string().optional(),
        age: z.number().optional().int().max(100).min(20),
        gender: z.enum(["male", "female"]).optional(),
        // maybe it's a bad idea
        //img: z.string().optional()
    })

    return EditProfile.parse(rawData)

}



export default {
    validateRegisteration,
    validateLogin, 
    validateUserId, 
    validateEditProfile
}