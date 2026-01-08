import { NextFunction, Request, Response } from "express";
import { checkJWT } from "../utils/jwt";

export const emailVerificationAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.query;
  if (typeof token !== "string") {
    return res.status(400).json({
      status: 400,
      message: "Invalid token",
    });
  }
  const payload = checkJWT(token);
  req.userEmail = payload.email;
  next();
};
