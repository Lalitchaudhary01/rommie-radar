import { User } from "@/models/user.model";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export const signup = async (req: Request) => {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password, phone } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    await newUser.save();

    const token = signToken({ id: newUser._id });

    return NextResponse.json(
      { message: "User created successfully", token },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Signup failed", error },
      { status: 500 }
    );
  }
};

export const login = async (req: Request) => {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const token = signToken({ id: user._id });

    return NextResponse.json(
      { message: "Login successful", token },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Login failed", error },
      { status: 500 }
    );
  }
};
