import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { User, UserSchema } from "../user/user.model"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import * as bcrypt from "bcrypt"
import { JwtModule } from "@nestjs/jwt"
import { JwtStrategy } from "./stategy"

@Module({
    imports: [
        MongooseModule.forFeatureAsync([{
            name: User.name,
            useFactory: () => {
                const schema = UserSchema
                schema.pre("save", async function () {
                    const user = this
                    if (user.isModified("password")){
                        user.password = bcrypt.hashSync(user.password, parseInt(process.env.SALT))
                    }
                })
                return schema
            }
        }]),
        JwtModule.register({})
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule { }

