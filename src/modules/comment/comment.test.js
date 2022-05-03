import requestServices from '../request/request.service'
import commentServices from './comment.service'
import globalStub from '../../config/tests/test'
import mongoose from 'mongoose'

describe("Comment unit tests : ", () => {

    const requestData = globalStub.API_DATA.REQUEST.NORMAL
    const commentData = globalStub.API_DATA.COMMENT.NEW_COMMENT
    const commentEdit = globalStub.API_DATA.COMMENT.EDITED_COMMENT
    let requestId 

    let customer = {
        _id : mongoose.Types.ObjectId().toString()
    }

    let mod = {
        _id : mongoose.Types.ObjectId().toString(),
        account_id : "some_id_only_for_testing"
    }

    it("should add comment on a request with state of 'on'", async () => {

        const request = await requestServices.createRequest(customer, requestData)

        requestId = request._id.toString()

        // adding the comment
        const comment = await commentServices.addComment(mod, requestId, commentData)

        expect(comment.text).toBe(commentData.text)

    })

    it("should edit a comment by the requestId", async () => {

        const comment = await commentServices.editComment(mod, requestId, commentEdit)

        expect(comment.text).toBe(commentEdit.text)

    })

    it("should get all the comments under a request", async () => {

        const comment = await commentServices.getRequestComments(requestId)

        expect(comment).toHaveLength(1)

    })

    // ToDo : get the verification token


})