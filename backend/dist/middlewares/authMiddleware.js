"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return res.status(401).json({ error: "Access denied, token missing" });
    jsonwebtoken_1.default.verify(token, config_1.config.jwtToken, (err, decoded) => {
        if (err)
            return res.status(403).json({ error: "Invalid token" });
        req.userId = decoded.userId;
        next();
    });
};
exports.authenticateToken = authenticateToken;
