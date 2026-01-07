"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ctrlWrapper = (ctrl) => {
    const func = async (req, res, next) => {
        try {
            await ctrl(req, res, next);
        }
        catch (error) {
            //function overloading
            //automatically next looks for error handler, which for him is function that has four arguments in server
            next(error);
        }
    };
    return func;
};
exports.default = ctrlWrapper;
