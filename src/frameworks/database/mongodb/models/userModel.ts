import mongoose, { Schema, Document, model } from "mongoose";

// Define the interface for the User document
interface IUser extends Document {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: number;
  password: string;
  role: string;
  isActive: boolean;
  bio: string;
  imageUrl: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
}

// Define the schema for the User document
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
      trim: true,
      maxlength: 32,
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
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  },
  { timestamps: true }
);

// Create and export the User model
const User = model<IUser>("User", userSchema);
export { User, IUser };
