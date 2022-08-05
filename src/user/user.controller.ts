import { Body, Controller, FileTypeValidator, Get, HttpCode, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common"
import { UserService } from "./user.service"
import { CustomJwtGuard } from "../auth/guard/jwt-guard"
import { GetUser } from "../auth/decorator/get-user.decorator"
import { User, UserDocument } from "./user.model"
import { ResTransformInterceptor } from "../transformer/transformer.interceptor"
import { EditUserDto } from "./dto"
import { FileInterceptor } from "@nestjs/platform-express"
import { strorageOpts } from "src/storage/storage.validation"

@Controller("users")
@UseGuards(CustomJwtGuard)
@UseInterceptors(ResTransformInterceptor)
export class UserController {

    // the injected service in the constructor
    constructor(private userService: UserService) {}

    // the user routes goes here ...
    // users/me
    @Get("me")
    getMe(@GetUser() user: User) {
        return user 
    } 

    // GET /users/:id
    @Get(":id")
    async getUserById(@Param() params: { id: string }) {
        return this.userService.getUserById(params.id)
    } 

    // edit my profile
    // TODO: it can get empty request body, fix it 
    @Patch("edit")
    editProfile(@GetUser("id") userId: string, @Body() editUserDto: EditUserDto) {
        return this.userService.editProfile(userId, editUserDto)
    } 

    // TODO
    // handle img update in the same route for the edit
    // use remote database for static files
    @Post("upload")
    @UseInterceptors(FileInterceptor("img", strorageOpts))
    uploadProfileImg(@GetUser("id") userId: string, @Request() req : {img: string, user:UserDocument}, @UploadedFile(
        new ParseFilePipe(({
            validators: [
                new FileTypeValidator({ fileType: new RegExp("png|jpeg")}),
                new MaxFileSizeValidator({ maxSize: 2 * 1000_000 }) // 2 mb
            ]
        }))
    ) file : any) {
        this.userService.updateUserProfileImg(userId, file.path) 

        // just for consitent response 
        return []
    }
}
