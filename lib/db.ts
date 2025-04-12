import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI!); // ✅ Correct

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error", error);
  }
};
