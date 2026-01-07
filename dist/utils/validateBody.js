"use strict";
//decorator is a function to which as an argument we pass another function and it creates a wrapper and returns...
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const validateBody = (schema) => {
    const func = (req, res, next) => {
        //by default joi breaks check after finding the first mistake, so abortEarly: false tells it to check all field at once
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next((0, http_errors_1.default)(400, error.message));
        }
        next();
    };
    //the function is not called, it's returned and express sees the func and injects in it req, res, next automatically
    return func;
};
exports.default = validateBody;
//in Joi .validate is sync operation and there is also async one: validateAsync, which should be in trycatch because 
//!!! async code doesn't return error, but throws it !!!
// const fucn = async (req, res, next) => {
//
// try {
//       schema.validateAsync(req.body, { abortEarly: false });
//       next();
//     } catch (error) {
//       if (error instanceof Joi.ValidationError) {
//         return next(createHttpError(400, error.message));
//       }
//       return next(createHttpError(400, "Invalid request body"))
//     }
//   };
//
// next();
// }
