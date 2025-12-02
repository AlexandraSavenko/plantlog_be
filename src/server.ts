import express from "express";
import cors from 'cors';
import { env } from "./utils/env";
import plantsRouter from "./routers/plants";
import {notFoundHandler} from "./middlewares/notFoundHandler"
import { errorHandler } from "./middlewares/errorHandler";

export const startServer = () => {
const app = express();
app.use(cors())

//creating middleware with object plantsRouter;
app.use("/plants", plantsRouter);

app.use(notFoundHandler)

app.use(errorHandler)

const port = Number(env("PORT", 3000))

app.listen(port, () => console.log(`"Server runs on ${port} PORT"`))
}
