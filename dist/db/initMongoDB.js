"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMongoDB = void 0;
//mongodb+srv://Alex:<db_password>@cluster0.uejyekf.mongodb.net/my-plants?appName=Cluster0
const env_1 = require("../utils/env");
const mongoose_1 = __importDefault(require("mongoose"));
const initMongoDB = async () => {
    try {
        const user = (0, env_1.env)("MONGODB_USER");
        const password = (0, env_1.env)("MONGODB_PASSWORD");
        const url = (0, env_1.env)("MONGODB_URL");
        const db = (0, env_1.env)("MONGODB_DB");
        await mongoose_1.default.connect(`mongodb+srv://${user}:${password}@${url}/${db}?appName=Cluster0`);
        console.log("MongoDB connection successful");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error connect database with message ${error.message}`);
        }
        else {
            console.log("Error connect database with message", error);
        }
    }
};
exports.initMongoDB = initMongoDB;
