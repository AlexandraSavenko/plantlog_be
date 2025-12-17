import { initMongoDB } from "./db/initMongoDB"
import { startServer } from "./server"
import { createDirIfNotExist } from "./utils/createDirIfNotExist";
import {TEMP_DIR, UPLOAD_DIR} from "./constants/images"
const boostrap = async() => {
    try {
       await initMongoDB();
    await createDirIfNotExist(TEMP_DIR)
    await createDirIfNotExist(UPLOAD_DIR)
    startServer() 
    } catch (error) {
        console.error("Startup failed:", error);
        process.exit(1)
    }
    
}

boostrap()