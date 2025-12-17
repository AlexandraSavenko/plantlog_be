import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import * as authServices from "../services/auth";
import createHttpError from "http-errors";

interface Session {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  accessToken: string;
  refreshToken: string;
  accessTokenValidUntil: Date;
  refreshTokenValidUntil: Date;
}
const setupSession = (res: Response, session: Session) => {
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  //no idea why session id could be saved in cookies, but obviously there could be some need
  //and it's for refresh
  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const signupController = async (req: Request, res: Response) => {
  const data = await authServices.signup(req.body);
  res.status(201).json({
    status: 201,
    message: "User has been successfully signed up",
    data: data.username,
  });
};

export const verifyController = async (req: Request, res: Response) => {
  if (!req.userEmail) {
    return createHttpError(400, "Could not verify email");
  }
  await authServices.verifyUser(req.userEmail);
  res.json({
    status: 200,
    message: "User has been verifies",
  });
};

export const signinController = async (req: Request, res: Response) => {
  const session = await authServices.signin(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: "User has been successfully signed in",
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshSessionController = async (req: Request, res: Response) => {
  const session = await authServices.refreshUserSession(req.cookies);
  setupSession(res, session);
  res.json({
    status: 200,
    message: "Session has been successfully refreshed",
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const signoutController = async (req: Request, res: Response) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    const data = await authServices.signout(sessionId);
  }
  res.clearCookie("sessionId");
  res.clearCookie("refreshToken");

  res.status(200).json({
    status: 200,
    message: "User has been successfully signed out",
  });
};
