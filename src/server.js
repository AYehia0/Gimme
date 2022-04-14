#!/usr/bin/env node --experimental-specifier-resolution=node
import app from './app'
import auth from './middlewares/auth'
import 'dotenv/config'

import MainSocket from '../src/utils/socket'

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
    console.log(`Server is running on : http://localhost:${PORT}`)
})


// making it global for all the project 
import {Server} from 'socket.io'
global.io = new Server(server)
global.io.use(auth.socketAuth)
global.io.on('connection', MainSocket.connection)