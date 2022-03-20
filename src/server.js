const app = require("./app.js")
require('dotenv').config()

const MainSocket = require('../src/utils/socket')
const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
    console.log(`Server is running on : http://localhost:${PORT}`)
})


// making it global for all the project 
global.io = require('socket.io')(server)
global.io.on('connection', MainSocket.connection)