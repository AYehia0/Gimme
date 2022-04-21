import app from '../src/app'
import supertest from 'supertest'
import {API_DATA, CODES, getUserByEmail, getRequestByUserId} from '../src/config/test'

const request = supertest(app)

// the url related to the user
import 'dotenv/config'
const mainUrl = `${process.env.MAIN_API}/${process.env.COMMENT_API}`

/*
requires : 
    - user as MOD
    - request
Tests for : 
    - Add Comment
    - Delete Comment
    - Edit Comment 
        - Before request is fulfilled 
        - After request is fulfilled
    - Get Verification Token 
        - Before request is fulfilled 
        - After request is fulfilled
*/

const commentTests = () => {
    let modUserToken = ""
    let requestId = ""
    let commentId = ""

    // before testing create a temp db
    it("Comment : should add a comment to a request ", async () => {

        // getting the token 
        const userMod = await getUserByEmail(API_DATA.REGISTER.USER_MOD.email)
        const userNormal = await getUserByEmail(API_DATA.REGISTER.USER_NORMAL.email)
        const req = await getRequestByUserId(userNormal._id)

        requestId = req?._id
        modUserToken = userMod.token

        const res = await request.post(`${mainUrl}/comment/${requestId}`)
        .set("Authorization", `Bearer ${modUserToken}`)
        .send(API_DATA.COMMENT.NEW_COMMENT)
        .expect(CODES.OK)


        commentId = res.body.data._id

        expect(res.body.status).toBe(true)
    })

    it("Comment : should edit a comment", async () => {

        const res = await request.put(`${mainUrl}/comment/${requestId}`)
        .set("Authorization", `Bearer ${modUserToken}`)
        .send(API_DATA.COMMENT.EDITED_COMMENT)
        .expect(CODES.OK)


        expect(res.body.status).toBe(true)
    })
 

}
export default commentTests