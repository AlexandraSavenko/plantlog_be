//mongodb+srv://Alex:<db_password>@cluster0.uejyekf.mongodb.net/my-plants?appName=Cluster0
import {env} from "../utils/env";
import mongoose from "mongoose";

export const initMongoDB = async () => {
    try {
        const user = env("MONGODB_USER");
        const password = env("MONGODB_PASSWORD");
        const url = env("MONGODB_URL");
        const db = env("MONGODB_DB")
        await mongoose.connect(`mongodb+srv://${user}:${password}@${url}/${db}?appName=Cluster0`)
    console.log("MongoDB connection successful")
    } catch (error) {
        if(error instanceof Error){
                    console.error(`Error connect database with message ${error.message}`)
        }else{console.log("Error connect database with message", error)}
    }
}
