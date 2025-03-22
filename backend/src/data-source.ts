import { DataSource } from "typeorm"
import * as dotenv from "dotenv"
import { config } from "./config"

dotenv.config()

const isProduction = process.env.NODE_ENV === "production"

const AppDataSource = new DataSource(
    isProduction
        ? {
              type: process.env.DB_TYPE as any,
              host: process.env.DB_HOST,
              port: Number(process.env.DB_PORT),
              username: process.env.DB_USERNAME,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_NAME,
              synchronize: false,
              logging: true,
              entities: [__dirname + "/../dist/entities/*.js"],
              migrations: ["dist/migrations/**/*.js"],
              ssl: { rejectUnauthorized: false },
          }
        : {
              type: "postgres" as any,
              host: "db",
              port: 5432,
              username: "expboost",
              password: "mypassword",
              database: "expboost",
              synchronize: false,
              logging: true,
              entities: [__dirname + "/../dist/entities/*.js"],
              migrations: ["dist/migrations/**/*.js"],
              ssl: false,
          }
        // : {
        //       type: (process.env.DB_TYPE as any) || "postgres",
        //       host: config.db.host,
        //       port: config.db.port || 5432,
        //       username: config.db.username,
        //       password: config.db.password,
        //       database: config.db.name,
        //       synchronize: false,
        //       logging: true,
        //       entities: [__dirname + "/../dist/entities/*.js"],
        //       migrations: ["dist/migrations/**/*.js"],
        //       ssl: { rejectUnauthorized: false },
        //   },
)

export default AppDataSource
