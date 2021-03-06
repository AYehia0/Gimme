// connection to the mongodb 
import mongoose from 'mongoose'
mongoose.Promise = global.Promise

const connect = async (dbNAME)  => {

    //const dbNAME = process.env.DB_NAME || "test"
    const dbURL = `mongodb://127.0.0.1:27017/`

    // don't connect only if it's testing, as I am using mongoose in memory
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



export default {
    connect,
    drop
}