import { kMaxLength } from "buffer";
import mongoose, { Schema, model } from "mongoose";

const userSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      maxlength: 32,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 32,
    },
    userName: {
      type: String,
      trim:true,
      maxlength:32
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please add a valid email"],
    },
    phone: {
      type: Number,
      maxlength: 10,
    },
    password: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    bio: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',default:[] }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',default:[] }],
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
