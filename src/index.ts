import { initMongoDB } from "./db/initMongoDB"
import { startServer } from "./server"

console.log("Welcome to plantlog")

const boostrap = async() => {
    await initMongoDB();
    startServer()
}

boostrap()