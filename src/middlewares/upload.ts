import multer, {FileFilterCallback} from "multer";
import { TEMP_DIR } from "../constants/images";
import createHttpError from "http-errors";
import { Request } from "express";

//multer middleware is used in routers/plants.ts and with exact name of the field of the file


//discstorage is a factory function
const storage = multer.diskStorage({
  // destination: (req, file, callback) => {
  // //req is Express req object
  // //first argument could be either new Error (which multer will send to frontend itself) and second one will be path
  // callback(null, TEMP_DIR)
  //     }
  destination: TEMP_DIR,
  filename: (req, file, callback) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePrefix}_${file.originalname}`;
    callback(null, filename);
  },
});


const limits = {
    fileSize: 1024 * 1024 * 5
}

//fileFilter is a callback hook
const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    const extention = file.originalname.split(".").pop()
    if(extention === "exe"){
return callback(createHttpError(400, ".exe extention is not allowed"))
    }
    //true in callback means file can be saved
    callback(null, true)
}

export const upload = multer({
    storage,
    limits,
    fileFilter
})

