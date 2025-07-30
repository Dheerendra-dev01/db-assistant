import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/db-assistant';

class connectDatabase{
public connectDb = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {});
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:");
        process.exit(1); 
    }
};


}

export default new connectDatabase()
