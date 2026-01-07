"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFileToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const promises_1 = require("node:fs/promises");
const env_1 = require("./env");
const cloud_name = (0, env_1.envString)("CLOUDINARY_CLOUD_NAME");
const api_key = (0, env_1.envString)("CLOUDINARY_API_KEY");
const api_secret = (0, env_1.envString)("CLOUDINARY_API_SECRET");
cloudinary_1.v2.config({
    cloud_name,
    api_key,
    api_secret
});
const saveFileToCloudinary = async (file, folder) => {
    try {
        const response = await cloudinary_1.v2.uploader.upload(file.path, {
            folder
        });
        return response.secure_url;
    }
    catch (error) {
        throw error;
    }
    finally {
        await (0, promises_1.unlink)(file.path);
    }
};
exports.saveFileToCloudinary = saveFileToCloudinary;
