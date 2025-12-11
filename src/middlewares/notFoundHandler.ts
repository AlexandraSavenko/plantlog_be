import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (req: Request, res: Response) => {
     console.log("It's me notFoundHandler")
    return res.status(404).json({
    message: `${req.url} not found`
})}