"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    const status = error.status ?? 500;
    const message = error.message ?? "Server error";
    res.status(status).json({
        status,
        message
    });
};
exports.errorHandler = errorHandler;
