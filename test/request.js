const app = require("../src/app")
const supertest = require("supertest")
const {API_DATA, CODES, getTokenTest} = require("../src/config/test")
const mongoose = require("mongoose")
const request = supertest(app)

// the url related to the user
require('dotenv').config()
const mainUrl = `${process.env.MAIN_API}/${process.env.REQUEST_API}`


const requestTests = () => {
    

    let normalUserToken = ""
    let requestId = ""

    // what are the chance the request really exists ?
    const request404 = new mongoose.Types.ObjectId()

    // before testing create a temp db
    it("Request : Add a request ", async () => {

        // getting the token 
        const token = await getTokenTest(API_DATA.REGISTER.USER_NORMAL.email)
        normalUserToken = token

        const res = await request.post(`${mainUrl}/open`)
        .set("Authorization", `Bearer ${normalUserToken}`)
        .send(API_DATA.REQUEST.NORMAL)
        .expect(CODES.OK)


        requestId = res.body.data._id

        expect(res.body.status).toBe(true)
        expect(res.body.message).toBe("Request has been created !!!")
    })
    it("Request : should edit an existing request", async () => {
        const res = await request.put(`${mainUrl}/edit/${requestId}`)
        .set("Authorization", `Bearer ${normalUserToken}`)
        .send(API_DATA.REQUEST.EDITED.NORMAL)
        .expect(CODES.OK)

        expect(res.body.status).toBe(true)
        expect(res.body.message).toBe("Success : request has been edited !!!")
    })
    it("Request : should not edit a request with invalid body", async () => {
        const res = await request.put(`${mainUrl}/edit/${requestId}`)
        .set("Authorization", `Bearer ${normalUserToken}`)
        .send(API_DATA.REQUEST.EDITED.WRONG)
        .expect(CODES.BAD)

        expect(res.body.status).toBe(false)

        // ToDo : change the mongoose validation to create custom validators 
        //expect(res.body.message).toBe("Success : request has been edited !!!")
    })
    it("Request : should not edit a request that doesn't exist", async () => {
        const res = await request.put(`${mainUrl}/edit/${request404}`)
        .set("Authorization", `Bearer ${normalUserToken}`)
        .send(API_DATA.REQUEST.EDITED)
        .expect(CODES.NOT_FOUND)

        expect(res.body.status).toBe(false)
        expect(res.body.message).toBe("Corrupted ID or Request not found")
    })
    // ...
    // ToDo : more tests go here
    it("Request : should delete a request", async () => {
        const res = await request.delete(`${mainUrl}/delete/${requestId}`)
        .set("Authorization", `Bearer ${normalUserToken}`)
        //.expect(CODES.OK)

        console.log(res.body)

        expect(res.body.status).toBe(true)
        expect(res.body.message).toBe("Request has been deleted !!!")
    })



}
module.exports = requestTests 