import * as fs from "node:fs/promises";
import * as path from "node:path"
import { UPLOAD_DIR } from "../constants/images";

interface FileType{
    filename: string,
    path: string
}
export const saveFileToUploadDir = async (file: FileType) => {
    const newPath = path.join(UPLOAD_DIR, file.filename)
await fs.rename(file.path, newPath)
} 
// console.log(req.body)
// [Object: null prototype] {
//   name: 'ясень',
//   description: 'високий',
//   growthForm: 'tree',
//   origin: 'wild'
// }
// console.log(req.file)
// {
//   fieldname: 'photo',
//   originalname: 'ash.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'D:\\Projects\\plantlog_be\\temp',
//   filename: '1766048937771_499770280_ash.jpg',
//   path: 'D:\\Projects\\plantlog_be\\temp\\1766048937771_499770280_ash.jpg',
//   size: 10250
// }