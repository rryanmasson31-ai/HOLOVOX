import { NextResponse } from "next/server";
// import connectDB from "../../../../../lib/db";
// import AuthModel from "../../../models/User.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "@/app/models/User.model";
import connectDB from "../../../../../lib/db";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    console.log("Login payload:", { email });

    // Connect DB
    await connectDB();

    // Check if user exists
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    // Prepare user response (no password)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
    };

    // Generate Token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        verified: user.verified,
      },
      process.env.JWT_SECRET || "HolovoxSecretKey",
      { expiresIn: "1d" }
    );

    return NextResponse.json(
      { message: "Login successful", token, user: userData },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
