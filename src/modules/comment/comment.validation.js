import {z} from "zod"

const validateComment = (rawData) => {

    const Comment = z.object({
        text: z.string().nonempty("Text field can't be empty").max(200),
        price: z.number().nonnegative().gt(0),
        time: z.object({
            unit: z.enum(["w", "d", "h"]).default("d"),
            val: z.number().nonnegative().gt(0)
        })
    })

    return Comment.parse(rawData)

} 

export default {
    validateComment
}