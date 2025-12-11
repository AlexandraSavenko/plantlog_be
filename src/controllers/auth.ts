import { Request, Response, NextFunction } from "express";

import * as authServices from "../services/auth"
export const signupController =async (req: Request, res: Response) => {
const data = await authServices.signup(req.body)
res.status(201).json({
    status: 201,
    message: "User has been successfully signed up",
    data: data.username
})
}

export const signinController = async (req: Request, res: Response) => {
const data = await authServices.signin(req.body)
}

