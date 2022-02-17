// the db
require('./models/db')
require('dotenv').config()

// IMPORTS
// the main app
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')

// routers
const userRoutes = require('./routes/user')
const reviewRoutes = require('./routes/review')
const requestRoutes = require('./routes/request')

const app = express()

// i think they solved this shit 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

// middlewares
app.use(helmet())
app.use(cors())


// using the routes
app.use('/api/user', userRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/request', requestRoutes)

module.exports = app