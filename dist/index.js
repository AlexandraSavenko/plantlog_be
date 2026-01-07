"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const initMongoDB_1 = require("./db/initMongoDB");
const server_1 = require("./server");
const createDirIfNotExist_1 = require("./utils/createDirIfNotExist");
const images_1 = require("./constants/images");
const boostrap = async () => {
    try {
        await (0, initMongoDB_1.initMongoDB)();
        await (0, createDirIfNotExist_1.createDirIfNotExist)(images_1.TEMP_DIR);
        await (0, createDirIfNotExist_1.createDirIfNotExist)(images_1.UPLOAD_DIR);
        (0, server_1.startServer)();
    }
    catch (error) {
        console.error("Startup failed:", error);
        process.exit(1);
    }
};
boostrap();
