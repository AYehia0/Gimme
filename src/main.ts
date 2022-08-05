import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import helmet from "helmet"
import { ConfigService } from "@nestjs/config"
import { ValidationPipe } from "@nestjs/common"
import { ErrorFilter } from "./transformer/error.filter"


async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ["debug"] 
    })

    /* 
    * Configuration Services 
    * 
    * configService.get("PORT") == process.env.PORT
    * https://stackoverflow.com/a/66511014/16787671
    *
    */
    const configService = app.get(ConfigService)

    // global 
    // Important : using the validation pipes globally
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true
    }))
    
    app.useGlobalFilters(new ErrorFilter())
    app.setGlobalPrefix("/api")

    /* Security stuff : https://docs.nestjs.com/security */
    // helmet
    app.use(helmet())

    // Make sure to enable core to call the Server from different origins
    app.enableCors()

    await app.listen(configService.get("PORT"), () => {
        console.log(`Server is listening on : http://localhost:${configService.get("PORT")}`)
    })
}
bootstrap()
