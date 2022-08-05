import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { EditUserDto } from "./dto"
import { User, UserDocument } from "./user.model"

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

    // user services 

    /* 
    Return the current logged in user by ID, another method is to return the user from the request as req.user
    */
    getUserById (id: string){
        return this.userModel.findById(id)
    }

    // editProfile
    async editProfile(userId: string, profileData: EditUserDto) {
        await this.userModel.findByIdAndUpdate(userId, profileData)
    }

    async updateUserProfileImg(userId: string, imgPath: string) {
        await this.userModel.findByIdAndUpdate(userId, {
            img: imgPath
        })
    }

}
