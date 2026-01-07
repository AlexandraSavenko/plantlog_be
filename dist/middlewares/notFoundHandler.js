"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const notFoundHandler = (req, res) => {
    console.log("It's me notFoundHandler");
    return res.status(404).json({
        message: `${req.url} not found`
    });
};
exports.notFoundHandler = notFoundHandler;
