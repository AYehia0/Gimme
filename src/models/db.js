// connection to the mongodb 
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const dbNAME = process.env.DB_NAME || "test"
const dbURL = `mongodb://127.0.0.1:27017/${dbNAME}`

mongoose.connect(dbURL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    autoIndex: true,
}).catch(e => {
    console.log(e.message)
})
