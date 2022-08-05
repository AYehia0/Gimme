import { AuthGuard } from "@nestjs/passport";


// instead of directly writing AuthGuard("name-blah-blah"), we use export it as a class, to use directly
// this is better, as string errors can happen
export class CustomJwtGuard extends AuthGuard("auth-jwt") {
    constructor() {
        super()
    }
}
