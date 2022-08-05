import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";

@Injectable()
export class DbService {

    constructor(@InjectConnection() private readonly conn : Connection) { }

    // helper methods 
    getConnection (): Connection {
        return this.conn
    }

    cleanDb (): Promise<boolean> {
        return this.conn.db.dropDatabase()
    }

}
