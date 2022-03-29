const supertest = require("supertest")
const API_DATA = require("./dummy")
const mongoose = require("mongoose")
const app = require('../src/app')
const db = require('../src/config/db')
const { expectCt } = require("helmet")

// force a quit
const mainUrl = "api/user" 

// creating a request with the running
const PORT = process.env.PORT
const request = supertest.agent(`http://localhost:${PORT}/`)

require('dotenv').config()

const statusCodes = {
    notFound : 404,
    ok : 200,
    bad : 400
}

beforeAll(async () => {

    // starting the server
    app.listen(PORT)

    // connecting to the database
    db.connect(process.env.NODE_ENV)
})
afterAll(async () => {
    //
    await db.drop()
    mongoose.connection.close()
})

// User route 
// status code : true
describe("User Service Unit Tests : ", () => {
    // before testing create a temp db
    it("Should register a user to the database", async () => {
        const res = await request.post(`${mainUrl}/register`)
        .send(API_DATA.REGISTER.USER_NORMAL)
        .expect(statusCodes.ok)

        expect(res.body.status).toBe(true)
        expect(res.body.message).toBe("Success : User registered !!!")
    }, 5000)

})

