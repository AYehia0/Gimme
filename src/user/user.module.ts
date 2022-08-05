import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { User, UserSchema } from "./user.model"
import { UserService } from "./user.service"
import { UserController } from "./user.controller"
import * as bcrypt from "bcrypt"

@Module({
    // TODO: Fix this mess, move to a database module or whatever
    imports: [
        MongooseModule.forFeatureAsync([
            {
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
            },
            {
                name: User.name,
                useFactory: () => {
                    const schema = UserSchema
                    schema.set('toJSON', {
                        transform: function(doc, ret, opt) {
                            delete ret['password']
                            return ret
                        }
                    })
                }
            }]),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule { }
