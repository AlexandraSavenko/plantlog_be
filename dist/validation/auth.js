"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authOAuthGoogleSchema = exports.authSignInSchema = exports.authSignUpSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const users_1 = require("../constants/users");
exports.authSignUpSchema = joi_1.default.object({
    username: joi_1.default.string().required().messages({
        "string.empty": "name should not be empty string"
    }),
    email: joi_1.default.string().pattern(users_1.emailRegex).required(),
    password: joi_1.default.string().min(6).required().messages({
        "string.empty": "password should not be empty string"
    })
});
exports.authSignInSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required()
});
exports.authOAuthGoogleSchema = joi_1.default.object({
    code: joi_1.default.string().required()
});
