import { Request, Response, NextFunction } from "express";
import { getUserInfo } from "../services/users";

export const getUserController = async (req: Request, res: Response) => {
  const { _id } = req.user;
  const user = await getUserInfo(_id);
  res.json({
    status: 200,
    message: "Successfully found info about the current user",
    data: {
        userId: user?._id,
        username: user?.username,
        favoritePlants: user?.favoritePlants,
        authProvider: user?.authProvider
    }
  })
};
