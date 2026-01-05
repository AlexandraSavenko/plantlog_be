import Joi from "joi";
import { emailRegex } from "../constants/users";

export const authSignUpSchema = Joi.object({
    username: Joi.string().required().messages({
        "string.empty": "name should not be empty string"
    }),
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(6).required().messages({
        "string.empty": "password should not be empty string"
    })
});

export const authSignInSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});

export const authOAuthGoogleSchema = Joi.object({
    code: Joi.string().required()
});