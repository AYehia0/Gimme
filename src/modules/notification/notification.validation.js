import {z} from 'zod'


export default function (rawData) {
    const Notification = z.object({
        // 300 is too much, just in case google made stupid shit
        token: z.string().nonempty("Notification token can't be empty").max(300)
    })

    return Notification.parse(rawData)
}