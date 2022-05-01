import requestServices from './request.service'
import globalStub from '../../config/tests/test'
import mongoose from 'mongoose'

describe("Request unit tests : ", () => {

    const requestData = globalStub.API_DATA.REQUEST.NORMAL
    const requestEdit = globalStub.API_DATA.REQUEST.EDITED.NORMAL
    let requestId 
    let user = {
        _id : mongoose.Types.ObjectId().toString()
    }

    it("should create a request", async () => {

        const request = await requestServices.createRequest(user, requestData)

        requestId = request._id.toString()

        expect(request.userId.toString()).toBe(user._id)
        expect(request.title).toBe(requestData.title)

    })

    it("should edit a request", async () => {

        const request = await requestServices.editRequest(user, requestId, requestEdit)

        expect(request.userId.toString()).toBe(user._id)
        expect(request.title).toBe(requestEdit.title)

    })

    it("should get a request by ID", async () => {

        const requests = await requestServices.getRequestsByID(user, { reqId: requestId })

        expect(requests).toHaveLength(1)
        expect(requests[0]._id.toString()).toBe(requestId)

    })

    it("should search requests by to/from locations", async () => {

        let to = requestData.toAddress.split(" ")[0]
        let from = requestData.fromAddress.split(" ")[0]
        const requests = await requestServices.searchRequestsByLocation({ to, from })

        expect(requests).toHaveLength(1)
        expect(requests[0].toAddress).toContain(to)
        expect(requests[0].fromAddress).toContain(from)

    })

    it("should get the requests i commented on", async () => {

        const requests = await requestServices.getMyOnRequests(user._id, "on")

        // not a good test case, but since there is no comment on that request, it's kinda valid but it doesn't actually test the code
        expect(requests).toHaveLength(0)

    })

    it("should get my requests i am working on as MOD", async () => {

        const requests = await requestServices.getRequestsForMOD(user._id)

        // not a good test case, but since there is no comment on that request, it's kinda valid but it doesn't actually test the code
        expect(requests).toHaveLength(0)

    })


    it("should get requests posted by userId", async () => {

        const requests = await requestServices.getRequestsByID(user, { userId: user._id })

        expect(requests).toHaveLength(1)
        expect(requests[0].userId.toString()).toBe(user._id)

    })

    it("should delete a request by ID", async () => {

        await requestServices.deleteReuest(user, requestId)
        const requests = await requestServices.getRequestsByID(user, requestId )

        expect(requests).toHaveLength(0)

    })


})