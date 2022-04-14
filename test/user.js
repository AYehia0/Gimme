import app from '../src/app'
import supertest from 'supertest'
import {API_DATA, CODES} from '../src/config/test'

const request = supertest(app)

// the url related to the user
import 'dotenv/config'
const mainUrl = `${process.env.MAIN_API}/${process.env.USER_API}`

const userTests = () => {
    // configs returned from the res used to continue testing
    let normalUserToken = ""

    // before testing create a temp db
    it("Register : should register a user to the database", async () => {
        const res = await request.post(`${mainUrl}/register`)
        .send(API_DATA.REGISTER.USER_NORMAL)
        .expect(CODES.OK)

        expect(res.body.status).toBe(true)
        expect(res.body.message).toBe("Success : User registered !!!")
    }, 1000)

    it("Register : should register a user MOD to the database", async () => {
        const res = await request.post(`${mainUrl}/register`)
        .send(API_DATA.REGISTER.USER_MOD)
        .expect(CODES.OK)

        expect(res.body.status).toBe(true)
        expect(res.body.message).toBe("Success : User registered !!!")
    })

    it("Register : should return user already exists", async () => {
        const res = await request.post(`${mainUrl}/register`)
        .send(API_DATA.REGISTER.USER_NORMAL)
        .expect(CODES.CONFLICT)

        expect(res.body.status).toBe(false)
        expect(res.body.message).toBe("Email/Phone Already Exists")
    })
    it("Login : should login a user", async () => {
        // login the mod too to fetch a correct token
        await request.post(`${mainUrl}/login`)
        .send(API_DATA.LOGIN.USER_MOD)
        

        const res = await request.post(`${mainUrl}/login`)
        .send(API_DATA.LOGIN.USER_NORMAL)

        //.expect(CODES.OK)

        // capturing the token
        // save it for all the requests
        normalUserToken = res.body.data

        expect(res.body.status).toBe(true)
        expect(res.body.message).toBe("Success : User has been logged in !!!")
        expect(res.body.data).toBeTruthy()
    })
    it("Login : should return user not found", async () => {
        const res = await request.post(`${mainUrl}/login`)
        .send(API_DATA.LOGIN.USER_NORMAL_404)
        .expect(CODES.NOT_FOUND)

        expect(res.body.status).toBe(false)
    })
    it("Login : should return wrong password/email", async () => {
        const res = await request.post(`${mainUrl}/login`)
        .send(API_DATA.LOGIN.USER_NORMAL_WRONG_PASS)
        .expect(CODES.FORBIDDEN)

        expect(res.body.status).toBe(false)
        expect(res.body.message).toBe("Incorrect Password/Email")
    })
    it("Profile : should return user's profile", async () => {
        const res = await request.get(`${mainUrl}/me`)
        .set("Authorization", `Bearer ${normalUserToken}`)
        .expect(CODES.OK)

        expect(res.body.status).toBe(true)
        expect(res.body.data._id).toBeTruthy()
    })
}
export default userTests