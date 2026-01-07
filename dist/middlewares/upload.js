"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const images_1 = require("../constants/images");
const http_errors_1 = __importDefault(require("http-errors"));
//multer middleware is used in routers/plants.ts and with exact name of the field of the file
//discstorage is a factory function
const storage = multer_1.default.diskStorage({
    // destination: (req, file, callback) => {
    // //req is Express req object
    // //first argument could be either new Error (which multer will send to frontend itself) and second one will be path
    // callback(null, TEMP_DIR)
    //     }
    destination: images_1.TEMP_DIR,
    filename: (req, file, callback) => {
        const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
        const filename = `${uniquePrefix}_${file.originalname}`;
        callback(null, filename);
    },
});
const limits = {
    fileSize: 1024 * 1024 * 5
};
//fileFilter is a callback hook
const fileFilter = (req, file, callback) => {
    const extention = file.originalname.split(".").pop();
    if (extention === "exe") {
        return callback((0, http_errors_1.default)(400, ".exe extention is not allowed"));
    }
    //true in callback means file can be saved
    callback(null, true);
};
exports.upload = (0, multer_1.default)({
    storage,
    limits,
    fileFilter
});
