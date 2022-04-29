import {z} from 'zod'
import validator from 'validator'

const validateRequest = (rawData) => {

    const Request = z.object({
        title: z.string().nonempty("Title can't be empty").max(200),
        body: z.string().nonempty("Body can't be empty").max(300),
        toLocation: z.object({
            type: z.string().default("Point"),
            coordinates : z.number().array().length(2).superRefine(([lat, long], ctx) => {
                if (!validator.isLatLong(`${lat},${long}`)){
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Invalid long/lat",
                        fatal: true,
                    })
                }
            })
        }),
        fromLocation: z.object({
            type: z.string().default("Point").transform((val) => "Point"),
            coordinates : z.number().array().length(2).superRefine(([lat, long], ctx) => {
                if (!validator.isLatLong(`${lat},${long}`)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Invalid long/lat",
                        fatal: true,
                    })
                }
            })
        }),
        toAddress: z.string().optional(),
        fromAddress: z.string().optional(),
        priceRange: z.object({
            min: z.number().nonnegative().gt(0),
            max: z.number().nonnegative().gt(0)
        }),
        timeRange: z.object({
            unit: z.enum(['w', 'd', 'h']).default('d'),
            val: z.number().nonnegative()
        })
    })

    console.log(Request.parse(rawData))
    return Request.parse(rawData)

}

const validateSearchRequest = (rawData) => {
    const Search = z.object({
        to: z.string().max(150).default(""),
        from: z.string().max(150).default("")
    }).refine(data => data.to || data.from, {message: "Can't have empty query, either to/from is required"})

    return Search.parse(rawData)
}

const validateRequestState = (rawData) => {
    const State = z.enum(["on", "closed", "fulfilled"]).default("on")

    return State.parse(rawData)

}

export default {
    validateRequest, 
    validateSearchRequest, 
    validateRequestState
}