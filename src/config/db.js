// connection to the mongodb 
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const connect = async (dbNAME)  => {

    //const dbNAME = process.env.DB_NAME || "test"
    const dbURL = `mongodb://127.0.0.1:27017/`

    if (dbNAME !== "test")
        mongoose.connect(dbURL, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            autoIndex: true,
            dbName : dbNAME
        }).catch(e => {
            console.log(e.message)
        })
}

const drop = async ()  => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        await collections[key].deleteMany();
    }
}



module.exports = {
    connect,
    drop
}