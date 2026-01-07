"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocs = void 0;
const node_fs_1 = require("node:fs");
const swagger_1 = require("../constants/swagger");
const http_errors_1 = __importDefault(require("http-errors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocs = () => {
    try {
        const swaggerText = (0, node_fs_1.readFileSync)(swagger_1.SWAGGER_PATH, "utf-8");
        const swaggerJSON = JSON.parse(swaggerText);
        return [...swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerJSON)];
    }
    catch (error) {
        return (req, res, next) => {
            next((0, http_errors_1.default)(500, "Can't load swagger docs"));
        };
    }
};
exports.swaggerDocs = swaggerDocs;
