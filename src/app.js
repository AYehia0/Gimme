// the db
require('./models/db')
require('dotenv').config()

// IMPORTS
// the main app
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const userRoutes = require('./routes/user.js')
const bodyParser = require('body-parser')

const app = express()

// i think they solved this shit 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

// middlewares
app.use(helmet())
app.use(cors())


// using the routes
app.use('/api/user', userRoutes)

module.exports = app
