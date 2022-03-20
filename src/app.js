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
app.use('/api/user', userRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/request', requestRoutes)
app.use('/api/comment', commentRoutes)
app.use('/api/room', roomRoutes)
app.use('/api/msg', messageRoutes)

module.exports = app