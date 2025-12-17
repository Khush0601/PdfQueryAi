// configs/db_config.ts
import dotenv from "dotenv"
dotenv.config()

interface IDBConfig {
  DB_URL: string;
}

const DBConfig: IDBConfig = {
  DB_URL: process.env.MONGO_URI as string || "" ,
}


export default DBConfig;
