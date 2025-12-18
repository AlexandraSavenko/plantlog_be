import express from "express";
import cors from 'cors';
import { env } from "./utils/env";
import plantsRouter from "./routers/plants";
import authRouter from "./routers/auth";
import {notFoundHandler} from "./middlewares/notFoundHandler"
import { errorHandler } from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";

export const startServer = () => {
const app = express();
app.use(cors())

//it's a buildin function to convert req.body to json, first it checks if there is content-type in Headers and then if it's json
//and puts json to req.body, but if instead of json it's form-data it bypasses the request
app.use(express.json())
//it's a lib that needs to be installed to read cookies npm i cookie-parser and npm i -D @types/cookie-parser
app.use(cookieParser())
//express by default doesn't give browser files (whatever has extention) but it will give files from the folder in express.static
app.use(express.static("uploads"))

//creating middleware with object plantsRouter; 
// first it checks if req.body headers have header called "Content-Type" (should be application/json)
// if it doesn't have it, the middleware passes it further, but if there is one it checks it
// it takes the body in buffer --> json.parse() --> passes further

app.use("/plants", plantsRouter);
app.use("/auth", authRouter);
app.use(notFoundHandler)

app.use(errorHandler)

const port = Number(env("PORT", 3000))

app.listen(port, () => console.log(`"Server runs on ${port} PORT"`))
}
