import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./auth/auth.module"
import { DbModule } from "./db/db.module"
import { UserModule } from "./user/user.module"

let pathToCurrentEnv: string = ".env.dev"

// pass the NODE_ENV to the start command in the package.json
if (process.env.NODE_ENV === "prod")
    pathToCurrentEnv = ".env.prod"
else if (process.env.NODE_ENV === "test")
    pathToCurrentEnv = ".env.test"

console.log("Choosing the right path to env : ", pathToCurrentEnv)
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal : true,
            envFilePath: pathToCurrentEnv
        }),
        AuthModule,
        UserModule,
        DbModule,
    ],
})
export class AppModule {}
