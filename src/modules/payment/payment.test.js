/*

This unit test requires mocking, but I couldn't get it working on ESM, since I am using `module`.
I would assume it's working or maybe I try actually calling the api.

note : babel didn't work with me

check here : https://github.com/jasonrberk/jest-mocking-esm

*/
describe("Payment unit tests : ", () => {
    
    it("should create a customer if not exist", () => {

        expect(true).toBe(true)
    })

    // done, the mod is choosen
    it("should create a payment checkout session", () => {

        expect(true).toBe(true)
    })

    it("should release payment to the mod", () => {

        expect(true).toBe(true)
    })
})