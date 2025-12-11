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
const {_id, accessToken, refreshToken, refreshTokenValidUntil} = await authServices.signin(req.body);

res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil
})
//no idea why session id could be saved in cookies, but obviously there could be some need
res.cookie("sessionId", _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil
})

res.json({
    status: 200,
    message: "User has been successfully signed in",
    data: {
        accessToken
    }
})
}

