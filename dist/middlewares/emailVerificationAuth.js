"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailVerificationAuth = void 0;
const jwt_1 = require("../utils/jwt");
const emailVerificationAuth = (req, res, next) => {
    const { token } = req.query;
    console.log("emailVerification has token", token);
    if (typeof token !== "string") {
        return res.status(400).json({
            status: 400,
            message: "Invalid token",
        });
    }
    const payload = (0, jwt_1.checkJWT)(token);
    req.userEmail = payload.email;
    next();
};
exports.emailVerificationAuth = emailVerificationAuth;
