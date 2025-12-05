import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";


const isValidId = (req: Request, res: Response, next: NextFunction) => {
const {id} = req.params;
if(!isValidObjectId(id)){
    return next(createHttpError(404, `${id} is not valid id`))
}
next();
}

export default isValidId;