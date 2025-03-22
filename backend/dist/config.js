"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
exports.config = {
    db: {
        type: process.env.DB_TYPE || "postgres",
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || "user",
        password: process.env.DB_PASSWORD || "password",
        name: process.env.DB_NAME || "database",
        url: process.env.DATABASE_URL || "",
    },
    rpcUrl: process.env.RPC_URL || "https://api.devnet.solana.com",
    walletSecret: process.env.SECRET
        ? process.env.SECRET.split(",").map((num) => parseInt(num.trim(), 10))
        : [],
    jwtToken: process.env.JWT_TOKEN || "",
};
