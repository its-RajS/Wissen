import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

//? mongose url
const dbUrl = process.env.DB_URL || "";

//! Connect our db
const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl).then((data: any) => {
      console.log(`Database connected at ${data.connection.host}`);
    });
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
