"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJWT = exports.createJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("./env");
const http_errors_1 = __importDefault(require("http-errors"));
const jwtSecret = (0, env_1.envString)("JWT_SECRET");
const createJWT = (email) => {
    return jsonwebtoken_1.default.sign({ email }, jwtSecret, { expiresIn: "24h" });
};
exports.createJWT = createJWT;
const checkJWT = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
    if (typeof decoded !== "object" ||
        decoded === null ||
        !("email" in decoded) ||
        typeof decoded.email !== "string") {
        throw (0, http_errors_1.default)(400, "Invalid token payload");
    }
    return decoded;
};
exports.checkJWT = checkJWT;
