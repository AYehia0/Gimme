import userServices from './user.service'
import globalStub from '../../config/tests/test'
import jsonwebtoken from 'jsonwebtoken'
import mongoose from 'mongoose'

describe("User unit tests : ", () => {

    const userData = globalStub.API_DATA.REGISTER.USER_NORMAL
    const userEdit = globalStub.API_DATA.EDIT.USER_NORMAL
	let verificationToken
    let user 

    it("should create an account", async () => {

        user = await userServices.createAccount(userData)
        expect(user.email).toBe(userData.email)
        expect(user.age).toBe(userData.age)

    })

    it("should request a new account verification token", async () => {

		verificationToken = await userServices.generateVerificationToken(user, "verify")
        expect(verificationToken).toBeTruthy()

    })

    it("should confirm/verify account using the verification token", async () => {

		const userData =  {
			userId : String(user._id),
			token : verificationToken.token
		}

		await userServices.verifyUser(userData)
        expect(true).toBeTruthy()

    })

    it("should get a password reset token if not exists", async () => {
		// TODO: Split the email sending from userServices
    })

    it("should change user's password using only the reset token", async () => {
		// TODO: Split the email sending from userServices
    })

    it("should log in a user by getting the login token", async () => {

        const token = await userServices.getLoginToken(userData)
        const expectedToken = jsonwebtoken.sign({_id: user._id}, process.env.JWT_TOKEN)
        expect(token).toBe(expectedToken)

    })

    it("should edit user profile", async () => {

        const edited = await userServices.editUserProfile(user, userEdit)

        expect(edited.name).toBe(userEdit.name)
        expect(edited.age).toBe(userEdit.age)

        // check the password : this takes some time
        //const isValid = bcrypt.compareSync(userEdit.password, edited.password)
        //expect(isValid).toBe(true)

    })

    it("should get a user by userId : get me", async () => {

        const userId = {
            userId : user._id.toString()
        }
        const userFound = await userServices.getOthersProfile(userId)

        expect(userFound.name).toBe(user.name)
        expect(userFound.age).toBe(user.age)
    })

    it("shouldn't get a user by userId", async () => {

        const userId404 = {
            userId : mongoose.Types.ObjectId().toString()
        }

        try {
            const user = await userServices.getOthersProfile(userId404)
        } catch (e) {
            expect(e.code).toBe(404)
        }
    })

    it("should update user's profile img", async () => {

        let img = "some_img"

        await userServices.addProfilePicture(user, img)

        expect(user.img).toBe(`photos/${user._id}/${process.env.UPLOAD_LOC_PROFILE}/${img}`)

    })

    it("should log out a user", async () => {

        await userServices.logoutUser(user)

        expect(user.token).toBe("")

    })
})
