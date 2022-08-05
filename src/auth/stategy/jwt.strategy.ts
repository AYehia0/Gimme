import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserDocument, User } from '../../user/user.model'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "auth-jwt") { // the name of the Strategy which is going to be used in the guards
    constructor(config: ConfigService, @InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
        super({
              jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
              ignoreExpiration: false,
              secretOrKey: config.get("JWT_TOKEN"),
        })
    }

    async validate(payload: any) {
        const user = await this.userModel.findById(payload.id)

        return user
    }

}
