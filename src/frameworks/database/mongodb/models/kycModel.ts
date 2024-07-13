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
  isAdminAccepted: boolean;
}


const KYCSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    dob: { type: Date, required: true },
    idType: { type: String, required: true,enum:["aadhar","passport","votersId","pan"] },
    idNumber: { type: String, required: true },
    phone: { type: String, required: true },
    isAdminAccepted: { type: String, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

// Create the KYC model using the schema
const KYC: Model<IKYC> = mongoose.model<IKYC>("KYC", KYCSchema);

export default KYC;
