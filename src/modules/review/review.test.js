import reviewService from './review.service'
import globalStub from '../../config/tests/test'
import mongoose from 'mongoose'

describe("Review unit tests : ", () => {

    let customer = {
        _id: mongoose.Types.ObjectId().toString()
    } 

    let mod = {
        _id: mongoose.Types.ObjectId().toString()
    }
   
    let commentId = mongoose.Types.ObjectId().toString()
    const requestData = globalStub.API_DATA.REQUEST.NORMAL
    const customerReview = globalStub.API_DATA.REVIEWS.USER_NORMAL
    const modReview = globalStub.API_DATA.REVIEWS.MOD
    let request

    beforeAll( async () => {
        request = await globalStub.createRequestWithMod(customer, mod, commentId)
    })

    it("should add review to a closed request as Customer", async () => {

        await reviewService.addReviewToRequest(customer, request._id.toString(), customerReview)

        const editedRequest = await globalStub.getRequestByUserId(customer._id)

        const rev = await globalStub.getReviewById(editedRequest.reviews[0])

        expect(editedRequest.reviews).toHaveLength(1)
        expect(rev.rate).toBe(customerReview.rate)
        expect(rev.body).toBe(customerReview.comment)

    })

    it("should add review to a closed request as MOD", async () => {

        await reviewService.addReviewToRequest(mod, request._id.toString(), modReview)

        const editedRequest = await globalStub.getRequestByUserId(customer._id)

        const rev = await globalStub.getReviewById(editedRequest.reviews[1])

        expect(editedRequest.reviews).toHaveLength(2)
        expect(rev.rate).toBe(modReview.rate)
        expect(rev.body).toBe(modReview.comment)
    })

    it("should get all the reviews of customer", async () => {

        const reviews = await reviewService.getUserReviews(customer._id)
        expect(reviews.as_customer).toBeTruthy()
        expect(reviews.as_mod).toHaveLength(0)
    })

    it("should get all the reviews of mod", async () => {

        const reviews = await reviewService.getUserReviews(mod._id)
        expect(reviews.as_mod).toBeTruthy()
        expect(reviews.as_customer).toHaveLength(0)
    })


})
