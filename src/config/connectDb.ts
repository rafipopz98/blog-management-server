import mongoose from "mongoose";
import { DB_URL } from "./config";

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("connected to DB");
  } catch (error) {
    console.log("error while connecting to DB", error);
  }
};
