import mongoose from "mongoose";
import { MONGODB_URI } from "./config";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("connected to DB");
  } catch (error) {
    console.log("error while connecting to DB", error);
  }
};
