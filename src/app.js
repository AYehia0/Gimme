// the db
import db from './config/db/db'

// connection to the db
db.connect(process.env.NODE_ENV)
import 'dotenv/config'

// IMPORTS
// the main app
import express from 'express'
import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
const __dirname = path.resolve()

// routers
import userRoutes from './modules/user/user.routes'
import reviewRoutes from './modules/review/review.routes'
import requestRoutes from './modules/request/request.routes'
import commentRoutes from './modules/comment/comment.routes'
import roomRoutes from './modules/room/room.routes'
import messageRoutes from './modules/message/message.routes'
import locationRoutes from './modules/location/location.routes'
import notificationRoutes from './modules/notification/notification.routes'
import paymentRoutes from './modules/payment/payment.routes'

// consts
const mainURL = process.env.MAIN_API

const app = express()

// getting the rawBody for stripe signature
// stripe security : to avoid 3rd party usage
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      const url = req.originalUrl;
      if (url.startsWith(`${mainURL}/${process.env.PAYMENT_API}/webhook`)) {
        req.rawBody = buf.toString()
      }
    }
  })
)

// i think they solved this shit 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

// middlewares
app.use(helmet())
app.use(cors())

// serving static files on the same server
// probably it's not a good idea as all real life app save to remote server
const uploadPath = path.join(__dirname, `${process.env.UPLOAD_LOC}`)
app.use("/photos", express.static(uploadPath))

// using the routes
app.use(`${mainURL}/${process.env.USER_API}`, userRoutes)
app.use(`${mainURL}/${process.env.REVIEW_API}`, reviewRoutes)
app.use(`${mainURL}/${process.env.REQUEST_API}`, requestRoutes)
app.use(`${mainURL}/${process.env.COMMENT_API}`, commentRoutes)
app.use(`${mainURL}/${process.env.ROOM_API}`, roomRoutes)
app.use(`${mainURL}/${process.env.MESSAGE_API}`, messageRoutes)
app.use(`${mainURL}/${process.env.LOCATION_API}`, locationRoutes)
app.use(`${mainURL}/${process.env.NOTIFICATION_API}`, notificationRoutes)
app.use(`${mainURL}/${process.env.PAYMENT_API}`, paymentRoutes)

export default app