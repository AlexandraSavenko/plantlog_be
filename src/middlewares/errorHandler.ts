import { NextFunction, Request, Response } from "express";
interface ApiError extends Error {
    status?: number;
    message: string;
}
export const errorHandler = (error: ApiError, req: Request, res: Response, next: NextFunction) => {
    const status = error.status ?? 500;
    const message = error.message ?? "Server error"
    res.status(status).json({
        status,
        message
    })
}