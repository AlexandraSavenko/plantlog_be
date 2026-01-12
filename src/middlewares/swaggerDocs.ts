import { readFileSync } from "node:fs"
import { SWAGGER_PATH } from "../constants/swagger"
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import swaggerUI from "swagger-ui-express";

//this function can't be async because to has to return a middleware
// readFileSync is used instead of readFile(which would return promise) to return text
export const swaggerDocs = () => {
    try {
        const swaggerText = readFileSync(SWAGGER_PATH, "utf-8");
        const swaggerJSON = JSON.parse(swaggerText);
        return [...swaggerUI.serve, swaggerUI.setup(swaggerJSON)]
    } catch (error) {
        return (req: Request, res: Response, next: NextFunction) => {
            next(createHttpError(500, "Can't load swagger docs"))
        }
    }
}