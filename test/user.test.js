const supertest = require("supertest")
const API_DATA = require("./dummy")
const mongoose = require("mongoose")
const app = require('../src/app')
const db = require('../src/config/db')

// force a quit
const mainUrl = "api/user" 

// creating a request with the running
const PORT = process.env.PORT
const request = supertest.agent(`http://localhost:${PORT}/`)

require('dotenv').config()

const statusCodes = {
    notFound : 404,
    ok : 200,
    bad : 400,
    conflict: 409,
    forbidden : 403
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
    // configs returned from the res used to continue testing
    normalUserToken = ""
    
    // before testing create a temp db
    it("Register : should register a user to the database", async () => {
        const res = await request.post(`${mainUrl}/register`)
        .send(API_DATA.REGISTER.USER_NORMAL)
        .expect(statusCodes.ok)

        expect(res.body.status).toBe(true)
        expect(res.body.message).toBe("Success : User registered !!!")
    }, 1000)
    it("Register : should return user already exists", async () => {
        const res = await request.post(`${mainUrl}/register`)
        .send(API_DATA.REGISTER.USER_NORMAL)
        .expect(statusCodes.conflict)

        expect(res.body.status).toBe(false)
        expect(res.body.message).toBe("Email/Phone Already Exists")
    })
    it("Login : should login a user", async () => {
        const res = await request.post(`${mainUrl}/login`)
        .send(API_DATA.LOGIN.USER_NORMAL)
        .expect(statusCodes.ok)

        // capturing the token
        normalUserToken = res.body.data

        expect(res.body.status).toBe(true)
        expect(res.body.message).toBe("Success : User has been logged in !!!")
        expect(res.body.data).toBeTruthy()
    })
    it("Login : should return user not found", async () => {
        const res = await request.post(`${mainUrl}/login`)
        .send(API_DATA.LOGIN.USER_NORMAL_404)
        .expect(statusCodes.notFound)

        expect(res.body.status).toBe(false)
    })
    it("Login : should return wrong password/email", async () => {
        const res = await request.post(`${mainUrl}/login`)
        .send(API_DATA.LOGIN.USER_NORMAL_WRONG_PASS)
        .expect(statusCodes.forbidden)

        expect(res.body.status).toBe(false)
        expect(res.body.message).toBe("Incorrect Password/Email")
    })
    it("Profile : should return user's profile", async () => {
        const res = await request.get(`${mainUrl}/me`)
        .set("Authorization", `Bearer ${token}`)
        .expect(statusCodes.ok)

        expect(res.body.status).toBe(true)
        expect(res.body.data._id).toBeTruthy()
    })
    it("Profile : should return user's profile", async () => {
        const res = await request.get(`${mainUrl}/me`)
        .set("Authorization", `Bearer ${token}`)
        .expect(statusCodes.ok)

        expect(res.body.status).toBe(true)
        expect(res.body.data._id).toBeTruthy()
    })



})