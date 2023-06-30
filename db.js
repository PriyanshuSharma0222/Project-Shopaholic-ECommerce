import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URL}`);
        console.log(`<<< SUCCESSFULLY CONNECTED TO DATABASE : ${conn.connection.host} >>>`);
    } catch (error) {
        console.log(`<<< FAILED TO CONNECT TO DATABASE : ${error} >>>`);
    }
}

export default connectDB;