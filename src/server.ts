import express from "express";
import cors from 'cors';
import { env } from "./utils/env";
import plantsRouter from "./routers/plants";
import {notFoundHandler} from "./middlewares/notFoundHandler"
import { errorHandler } from "./middlewares/errorHandler";

export const startServer = () => {
const app = express();
app.use(cors())

//it's a buildin function to convert req.body to json
app.use(express.json())

//creating middleware with object plantsRouter; 
// first it checks if req.body headers have header called "Content-Type" (should be application/json)
// if it doesn't have it, the middleware passes it further, but if there is one it checks it
// it takes the body in buffer --> json.parse() --> passes further
app.use("/plants", plantsRouter);

app.use(notFoundHandler)

app.use(errorHandler)

const port = Number(env("PORT", 3000))

app.listen(port, () => console.log(`"Server runs on ${port} PORT"`))
}
