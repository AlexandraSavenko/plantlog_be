import {v2 as cloudinary} from "cloudinary";
import { unlink } from "node:fs/promises";
import {envString} from "./env"
import { FileType } from "../types/images";


const cloud_name = envString("CLOUDINARY_CLOUD_NAME");
const api_key = envString("CLOUDINARY_API_KEY");
const api_secret = envString("CLOUDINARY_API_SECRET");

cloudinary.config({
    cloud_name,
    api_key,
    api_secret
})
export const saveFileToCloudinary = async (file: FileType, folder: string) => {
    try {
       const response = await cloudinary.uploader.upload(file.path, {
    folder
}) 
return response.secure_url;
    } catch (error) {
        throw error;
    }finally{
        await unlink(file.path)
    }

}