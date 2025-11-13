import express, { NextFunction, Request, Response } from "express";
import cors from 'cors';
import { env } from "./utils/env";
import PlantCollection from "./db/models/Plant";
// import pino from 'pino';

const port = Number(env("PORT", 3000))
export const startServer = () => {
    const app = express();
app.use(cors())
// const logger = pino({
// transport: {
//     target: 'pino-pretty'
// }
// });
// // app.use(logger);
app.get("/plants", async (req, res) => {
    const data = await PlantCollection.find()
    res.status(200).json({
        status: 200,
        message: "Plantlog the best",
        data
    })
})

app.use((req, res) => res.status(404).json({
    message: `${req.url} not found`
}))

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        message: error.message
    })
})

app.listen(port, () => console.log(`"Server runs on ${port} PORT"`))
}
