import { NextResponse } from "next/server";
// import connectDB from "../../../../../lib/db";
// import AuthModel from "../../../models/User.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "../../../../../lib/db";
import UserModel from "@/app/models/User.model";
// import cloudinary from "cloudinary";


// Cloudinary config
// cloudinary.v2.config({
//   cloud_name: "dfyvwloys",
//   api_key: "923835526253933",
//   api_secret: "JeNHRhqCYIfpkgu9hVcjwgf3P4A",
// });

export async function POST(request) {
  try {
    const { name, email, password, role } =
      await request.json();
      console.log("Payload for create-account:", {
        name,
        email,
        role,
      });

    // Connect to DB
    await connectDB();

    // Check if user already exists
    const existedUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existedUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // If profilePicture is base64 and provided, upload it to Cloudinary
//      let imageUrl = ""; // Default image if none uploaded
// if (image) {
//       try {
//         const uploadedResponse = await cloudinary.v2.uploader.upload(
//           image,
//           {
//             folder: "hashfor_users_profile_pictures",
//             transformation: [
//               { width: 1024, height: 1024, crop: "limit" }, // Resize to max 1024px
//               { quality: "auto", fetch_format: "auto" }, // Compress and auto format
//             ],
//           }
//         );
//         imageUrl = uploadedResponse.secure_url;
//       } catch (cloudinaryError) {
//         console.error("Cloudinary upload error:", cloudinaryError);
//         return NextResponse.json(
//           {
//             error:
//               "Image upload failed. Please use an image smaller than 10MB and in a supported format (JPG, PNG, etc).",
//           },
//           { status: 400 }
//         );
//       }
//     }
    // Hash password before saving
    const hashPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = await UserModel.create({
      name,
      email: email.toLowerCase(),
      password: hashPassword,
      role: role || "user",
      verified : "verified",
    });

    // Remove password field from response manually
    const userData = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      verified: newUser.verified,
    };

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        name: newUser?.name,
        verified : newUser?.verified,
      },
      process.env.JWT_SECRET || "HolovoxSecretKey",
      { expiresIn: "1d" }
    );

    return NextResponse.json(
      { message: "User created successfully", token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    await connectDB();

    // Fetch all users (exclude password)
    const users = await UserModel.find({}, "-password").sort({ createdAt: -1 });

    return NextResponse.json(
      { users },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
