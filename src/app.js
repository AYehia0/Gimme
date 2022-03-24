// the db
require('./config/db')
require('dotenv').config()

// IMPORTS
// the main app
const express = require('express')
const path = require('path')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')

// routers
const userRoutes = require('./routes/user')
const reviewRoutes = require('./routes/review')
const requestRoutes = require('./routes/request')
const commentRoutes = require('./routes/comment')
const roomRoutes = require('./routes/room')
const messageRoutes = require('./routes/message')
const locationRoutes = require('./routes/location')

// consts
const mainURL = process.env.MAIN_API

const app = express()

// i think they solved this shit 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

// middlewares
app.use(helmet())
app.use(cors())

// serving static files on the same server
// probably it's not a good idea as all real life app save to remote server
const uploadPath = path.join(__dirname, `../${process.env.UPLOAD_LOC}`)
app.use("/photos", express.static(uploadPath))

// using the routes
app.use(`${mainURL}/${process.env.USER_API}`, userRoutes)
app.use(`${mainURL}/${process.env.REVIEW_API}`, reviewRoutes)
app.use(`${mainURL}/${process.env.REQUEST_API}`, requestRoutes)
app.use(`${mainURL}/${process.env.COMMENT_API}`, commentRoutes)
app.use(`${mainURL}/${process.env.ROOM_API}`, roomRoutes)
app.use(`${mainURL}/${process.env.MESSAGE_API}`, messageRoutes)
app.use(`${mainURL}/${process.env.LOCATION_API}`, locationRoutes)

module.exports = app