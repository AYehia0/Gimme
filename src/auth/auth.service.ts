import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { RegisterUserDto, LoginUserDto } from "./dto"
import { User, UserDocument } from "../user/user.model"
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class AuthService {
    // since we're using the User Model and the JWT, it's important to inject in the constructor
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>, 
        private jwt: JwtService,
        private config: ConfigService
    ) { }

    async registerUser (registerUserDto: RegisterUserDto ): Promise<User> {
        const user = new this.userModel(registerUserDto)
        return user.save()
    }

    async loginUser (loginUserDto: LoginUserDto ) {
        // find the user
        const user = await this.userModel.findOne({
            email: loginUserDto.email
        })

        if (!user)
           throw new NotFoundException("User not registered, register first!") 

        // check the password
        const isValidPassword = bcrypt.compareSync(loginUserDto.password, user.password)

        if (!isValidPassword)
            throw new ForbiddenException("Password is incorrect!")
        
        // login a user
        const token = this.genToken(user.id, user.email)

        return token
    }

    // generate the token and save to db
     genToken (userId: string, email: string): Promise<string> {

        const payload = {
            id: userId,
            email
        }

        return this.jwt.signAsync(payload, {
            expiresIn: this.config.get("JWT_TOKEN_EXPIRE"),
            secret: this.config.get("JWT_TOKEN")
        })

    }
}
