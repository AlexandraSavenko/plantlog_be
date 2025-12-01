import express, { NextFunction, Request, Response } from "express";
import cors from 'cors';
import { env } from "./utils/env";
import plantsRouter from "./routers/plants";

const port = Number(env("PORT", 3000))
export const startServer = () => {
    const app = express();
app.use(cors())

//creating middleware with object plantsRouter;
app.use("/plants", plantsRouter);

app.use((req, res) => res.status(404).json({
    message: `${req.url} not found`
}))

interface ApiError extends Error {
    status?: number;
    message: string;
}
app.use((error: ApiError, req: Request, res: Response, next: NextFunction) => {
    const status = error.status ?? 500;
    const message = error.message ?? "Server error"
    res.status(status).json({
        status,
        message
    })
})

app.listen(port, () => console.log(`"Server runs on ${port} PORT"`))
}
