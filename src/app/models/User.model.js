import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    verified:{
      type: String,
      enum:["verified","unverified"],
      default:"unverified"
    },
    // image:{
    //   type: String,
      
    // }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Prevent model overwrite during hot reloads (for Next.js)
const UserModel =
  mongoose.models.HolovoxUser || mongoose.model("HolovoxUser", UserSchema);

export default UserModel;
