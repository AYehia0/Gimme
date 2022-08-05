// for accessing all the dotenv vars with autocomplete
declare global {
  namespace Express {
    interface User {
      _id: string
    }
  }
}
declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: string
        DB_URL_TEST:string
    }
}
