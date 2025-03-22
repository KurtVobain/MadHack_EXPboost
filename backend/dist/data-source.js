"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
const config_1 = require("./config");
dotenv.config();
const isDocker = process.env.NODE_ENV === "production";
const AppDataSource = new typeorm_1.DataSource(isDocker
    ? {
        type: process.env.DB_TYPE,
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
        type: process.env.DB_TYPE || "postgres",
        host: config_1.config.db.host,
        port: config_1.config.db.port || 5432,
        username: config_1.config.db.username,
        password: config_1.config.db.password,
        database: config_1.config.db.name,
        synchronize: false,
        logging: true,
        entities: [__dirname + "/../dist/entities/*.js"],
        migrations: ["dist/migrations/**/*.js"],
        ssl: { rejectUnauthorized: false },
    });
exports.default = AppDataSource;
