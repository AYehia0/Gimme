import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { DbService } from "./db.service";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get("DB_URL"),
                useNewUrlParser: true, 
                useUnifiedTopology: true,
                autoIndex: true,
            }),
            inject: [ConfigService]
        }),
    ],
    providers: [DbService],
    exports: [DbService]
})
export class DbModule {}

