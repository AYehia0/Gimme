import mongoose from 'mongoose'
import app from '../src/app'
import supertest from 'supertest'
import {API_DATA, CODES, getUserByEmail} from '../src/config/test'

const request = supertest(app)

// the url related to the user
import 'dotenv/config'
const mainUrl = `${process.env.MAIN_API}/${process.env.REQUEST_API}`

const requestTests = () => {
    

    let normalUserToken = ""
    let requestId = ""
    let requestIdDelete = ""

    // what are the chance the request really exists ?
    const request404 = new mongoose.Types.ObjectId()

    // before testing create a temp db
    it("Request : should create a new request ", async () => {

        // getting the token 
        const user = await getUserByEmail(API_DATA.REGISTER.USER_NORMAL.email)
        normalUserToken = user.token

        // one temp request to be deleted lol
        const tempRes = await request.post(`${mainUrl}/open`)
        .set("Authorization", `Bearer ${normalUserToken}`)
        .send(API_DATA.REQUEST.NORMAL)
      
        requestIdDelete = tempRes.body.data._id

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

    // searching requests in the db by locations (to/from)
    it("Request : should search requests", async () => {
        const res = await request.get(`${mainUrl}/search?to=tanta&from=cairo`)
        .set("Authorization", `Bearer ${normalUserToken}`)
        .expect(CODES.OK)

        expect(res.body.status).toBe(true)
        expect(Array.isArray(res.body.data)).toBe(true)
        expect(res.body.data).toHaveLength(res.body.data.length)
    })

    // Get request by ID
    it("Request : should get a request by ID", async () => {
        const res = await request.get(`${mainUrl}/requests?id=${requestId}`)
        .set("Authorization", `Bearer ${normalUserToken}`)
        .expect(CODES.OK)

        expect(res.body.status).toBe(true)
        expect(Array.isArray(res.body.data)).toBe(true)
        expect(res.body.data).toHaveLength(1)
    })

    //Get all the requests a user made
    it("Request : should get all the requests a user posted", async () => {
        const res = await request.get(`${mainUrl}/requests`)
        .set("Authorization", `Bearer ${normalUserToken}`)
        .expect(CODES.OK)

        expect(res.body.status).toBe(true)
        expect(Array.isArray(res.body.data)).toBe(true)
        expect(res.body.data).toHaveLength(res.body.data.length)
    })

    // get my requests i am doing aka work
    it("Request : should get fulfilled requests I am working on", async () => {
        const res = await request.get(`${mainUrl}/subscribed`)
        .set("Authorization", `Bearer ${normalUserToken}`)
        .expect(CODES.OK)

        expect(res.body.status).toBe(true)
        expect(Array.isArray(res.body.data)).toBe(true)

        // it will give empty list since there is no MOD
        expect(res.body.data).toHaveLength(0)
    })

    it("Request : should delete a request", async () => {
        const res = await request.delete(`${mainUrl}/delete/${requestIdDelete}`)
        .set("Authorization", `Bearer ${normalUserToken}`)
        .expect(CODES.OK)

        expect(res.body.status).toBe(true)
        expect(res.body.message).toBe("Request has been deleted !!!")
    })

}
export default requestTests 