// running the mongoServer before all the tests and closes it after the tests
// https://stackoverflow.com/a/65739866
// "globalSetup": "src/config/global-test.js"
// "globalTeardown": "tear-down-file-path"

import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from 'mongoose'

beforeAll(async () => {

    // creating a mongoServer, good practice is to mock the service
    const mongoServer = await MongoMemoryServer.create()

    await mongoose.connect(mongoServer.getUri())

})
afterAll(async () => {

    await mongoose.disconnect()
    await mongoose.connection.close()
})