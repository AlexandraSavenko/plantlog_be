import * as fs from "node:fs/promises";
import * as path from "node:path"
import { UPLOAD_DIR } from "../constants/images";
import { FileType } from "../types/images";


export const saveFileToUploadDir = async (file: FileType) => {
    const newPath = path.join(UPLOAD_DIR, file.filename)
await fs.rename(file.path, newPath)
} 
