import {z} from 'zod'

/*
    const opt =  {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || parseInt(process.env.CHAT_SIZE),
    } 
*/
export default function (rawData) {

    const GetMessages = z.object({
        page: z.string().regex(/^\d+$/).default('0').transform(Number),
        limit: z.string().regex(/^\d+$/).default(process.env.CHAT_SIZE).transform(Number),
    })

    return GetMessages.parse(rawData)
}