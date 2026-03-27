
import UserModel from "@/app/models/User.model";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectDB from "../../../../../lib/db";

// Create transporter (use real credentials in production)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "hashfor38@gmail.com",
    pass: "nmyioywkbiselqrv",
  },
});

// Temporary storage for OTPs (in production, use Redis or database)
const otpStorage = new Map();

export async function POST(request) {
  const { email } = await request.json();
  console.log("email", email);
  let lowerCaseEmail = email.toLowerCase();
  
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  
  await connectDB();
  const OTP = Math.floor(1000 + Math.random() * 9000);
  
  // Check if user already exists
  const existedEmail = await UserModel.findOne({ email:lowerCaseEmail });
  
  try {
    if (existedEmail) {
      return NextResponse.json(
        { error: "Account already exists" },
        { status: 400 }
      );
    }

    // Store OTP with expiration (10 minutes)
    let otpData = otpStorage.set(lowerCaseEmail, {
      otp: OTP,
      expiresAt: Date.now() + 2 * 60 * 1000 // 2 minutes
    });
console.log("Stored OTP Data:", otpData);

    await transporter.sendMail({
      to: email,
      subject: "Your OTP Code",
      html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #333333;">🔐 One-Time Password (OTP)</h2>
        <p style="font-size: 16px; color: #555555;">
          Please use the following OTP to complete your verification:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #4A90E2; background-color: #f0f8ff; padding: 10px 20px; border-radius: 6px;">
            ${OTP}
          </span>
        </div>
        <p style="font-size: 14px; color: #999999;">
          This code will expire in 10 minutes. Please do not share it with anyone.
        </p>
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #cccccc;">
          If you did not request this code, you can ignore this email.
        </p>
      </div>
    </div>
  `,
    });

    // Return OTP for testing — in production, don't send OTP back to frontend
    return NextResponse.json(
      // { message: "OTP sent successfully", otp: OTP },
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}

// New API endpoint to verify OTP
export async function PUT(request) {
  const { email, otp } = await request.json();
  console.log("Verifying OTP for:", email, otp);
  if (!email || !otp) {
    return NextResponse.json(
      { error: "Email and OTP are required" }, 
      { status: 400 }
    );
  }

  const storedOtpData = otpStorage.get(email.toLowerCase());
    console.log("Stored OTP Data:", storedOtpData);
  if (!storedOtpData) {
    return NextResponse.json(
      { error: "OTP not found or expired" }, 
      { status: 400 }
    );
  }

  // Check if OTP has expired
  if (Date.now() > storedOtpData.expiresAt) {
    otpStorage.delete(email.toLowerCase()); // Clean up expired OTP
    return NextResponse.json(
      { error: "OTP has expired" }, 
      { status: 400 }
    );
  }

  // Verify OTP
  if (storedOtpData.otp.toString() !== otp.toString()) {
    return NextResponse.json(
      { error: "Invalid OTP" }, 
      { status: 400 }
    );
  }

  // OTP is valid, remove it from storage
  otpStorage.delete(email.toLowerCase());
  
  return NextResponse.json(
    { message: "OTP verified successfully" }, 
    { status: 200 }
  );
}