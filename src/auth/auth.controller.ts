import { Body, Controller, ForbiddenException, Get, HttpCode, HttpException, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { RegisterUserDto, LoginUserDto } from "./dto"


@Controller("auth")
export class AuthController {

    // the injected service in the constructor
    constructor(private userService: AuthService) {}

    @Post("register")
    async registerUser(@Body() regData: RegisterUserDto) {
        try {
            await this.userService.registerUser(regData)

            // TODO: Make a template ASAP 
            return {
                status : true,
                msg: "Success",
                data: "",
            }
        } catch (error) {
            // mongoose duplicate
            if (error.code == "11000"){
                throw new ForbiddenException("User Already Exists")	
            }
        }
    }
    
    @Post("login")
    @HttpCode(200)
    async loginUser(@Body() loginData: LoginUserDto) {
        try {
            const token = await this.userService.loginUser(loginData)

            return {
                token
            }
        } catch (error) {
            throw error	
        }
    }
}
