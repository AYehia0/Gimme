import { Test } from "@nestjs/testing"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "../src/app.module"
import { DbService } from "../src/db/db.service"
import * as pactum from "pactum"
import { RegisterUserDto } from "src/auth/dto"

describe("AppController (e2e)", () => {
    let dbService : DbService
    let app: INestApplication
    let httpServer: any
    const PORT_TEST = 9090

    // drop the test database
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = moduleRef.createNestApplication()

        app.useGlobalPipes(new ValidationPipe({
            whitelist: true
        }))
        await app.init()
        await app.listen(PORT_TEST)

        dbService = app.get(DbService)

        // clean start
        await dbService.cleanDb()

        pactum.request.setBaseUrl(`http://localhost:${PORT_TEST}`)

    })

    afterAll(async () => {
        await app.close()
    })

    describe("Auth block", () => {
        const userRegDto: RegisterUserDto = {
            email: "customer@gamil.com",
            name : "customer",
            phone : "0102202032",
            password : "123",
            age : 24,
            gender : "male"
        }

        it("should throw error while registering a user [Missing Body]", () => {
            return pactum.spec()
                .post("/auth/register")
                .withBody({
                    email: userRegDto.email,
                    age: userRegDto.age
                })
                .expectStatus(400)
        })

        it("should register a user", () => {
            return pactum.spec()
                .post("/auth/register")
                .withBody(userRegDto)
                .expectStatus(201)
        })

        it("should throw error while logining a user [Missing Body]", () => {
            return pactum.spec()
                .post("/auth/login")
                .withBody({
                    email: userRegDto.email
                })
                .expectStatus(400)
        })

        it("should throw error while logining a user [Wrong Body]", () => {
            return pactum.spec()
                .post("/auth/login")
                .withBody({
                    email: userRegDto.email,
                    password: "wrong"
                })
                .expectStatus(403)
        })
        it("should login a user", () => {
            return pactum.spec()
                .post("/auth/login")
                .withBody({
                    email: userRegDto.email,
                    password: userRegDto.password
                })
                .expectStatus(200)
                .stores("token", "token")
        })
    })

    describe("User block", () => {

        const editUser = {
            name: "changeme",
            password : "helloCat:D"
        }
        
        it("should get user's profile", () => {
            return pactum.spec()
                .get("/users/me")
                .withHeaders({
                    Authorization: "Bearer $S{token}"
                })
                .expectStatus(200)
                .stores("userId", "data._id")
        })

        it("should get others profile by id", () => {
            return pactum.spec()
                .get("/users/$S{userId}")
                .withHeaders({
                    Authorization: "Bearer $S{token}"
                })
                .expectStatus(200)
        })

        it("should edit profile", () => {
            return pactum.spec()
                .patch("/users/edit")
                .withHeaders({
                    Authorization: "Bearer $S{token}"
                })
                .withBody(editUser)
                .expectStatus(200)
        })
    })
})
