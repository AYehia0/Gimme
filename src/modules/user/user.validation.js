// the validation schema using zod to verify user input
import {z} from 'zod'
import validator from 'validator'

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

export default {
    validateRegisteration
}