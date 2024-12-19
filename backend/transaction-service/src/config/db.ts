import mongoose from "mongoose";

const MONGO_URI='mongodb://127.0.0.1:27017/transaction_db'

export const connectDB= async()=>{
    try {
        await mongoose.connect(MONGO_URI)
        console.log('MongoDB Database connected')
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}