"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./utils/env");
const plants_1 = __importDefault(require("./routers/plants"));
const auth_1 = __importDefault(require("./routers/auth"));
const notFoundHandler_1 = require("./middlewares/notFoundHandler");
const errorHandler_1 = require("./middlewares/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swaggerDocs_1 = require("./middlewares/swaggerDocs");
const startServer = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    //it's a buildin function to convert req.body to json, first it checks if there is content-type in Headers and then if it's json
    //and puts json to req.body, but if instead of json it's form-data it bypasses the request
    app.use(express_1.default.json());
    //it's a lib that needs to be installed to read cookies npm i cookie-parser and npm i -D @types/cookie-parser
    app.use((0, cookie_parser_1.default)());
    //express by default doesn't give browser files (whatever has extention) but it will give files from the folder in express.static
    app.use(express_1.default.static("uploads"));
    //creating middleware with object plantsRouter; 
    // first it checks if req.body headers have header called "Content-Type" (should be application/json)
    // if it doesn't have it, the middleware passes it further, but if there is one it checks it
    // it takes the body in buffer --> json.parse() --> passes further
    app.use("/plants", plants_1.default);
    app.use("/auth", auth_1.default);
    app.use("/api-docs", (0, swaggerDocs_1.swaggerDocs)());
    app.use(notFoundHandler_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    const port = Number((0, env_1.env)("PORT", 3000));
    app.listen(port, () => console.log(`"Server runs on ${port} PORT"`));
};
exports.startServer = startServer;
