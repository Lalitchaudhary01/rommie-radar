import jwt from "jsonwebtoken";
import { User } from "@/models/user.model";
import { connectDB } from "@/lib/db";

export const getUserFromToken = async (token?: string) => {
  if (!token) return null;

  try {
    await connectDB();

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const user = await User.findById(decoded.id).select("-password");

    return user;
  } catch (error) {
    return null;
  }
};
