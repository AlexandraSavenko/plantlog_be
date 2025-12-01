import { initMongoDB } from "./db/initMongoDB"
import { startServer } from "./server"

const boostrap = async() => {
    await initMongoDB();
    startServer()
}

boostrap()