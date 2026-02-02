import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (req: Request, res: Response) => {
    return res.status(404).json({
    message: `${req.url} not found`
})}