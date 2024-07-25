import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Define the interface for the KYC document
interface IKYC extends Document {
  name: string;
  userId: Types.ObjectId;
  dob: Date;
  idType: string;
  idNumber: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  status: "pending" | "accepted" | "rejected";
  isAdminAccepted: boolean;
}

const KYCSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    dob: { type: Date, required: true },
    idType: {
      type: String,
      required: true,
      enum: ["aadhar", "passport", "votersId", "pan"],
    },
    idNumber: { type: String, required: true },
    phone: { type: String, required: true },
    isAdminAccepted: { type: Boolean, required: true, default: false },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Create the KYC model using the schema
const KYC: Model<IKYC> = mongoose.model<IKYC>("KYC", KYCSchema);

export default KYC;
