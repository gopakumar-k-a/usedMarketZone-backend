import mongoose, { Document, Schema, Model, mongo } from "mongoose";

export interface Imessage extends Document {
  senderId: mongoose.Types.ObjectId;
  recieverId: mongoose.Types.ObjectId;
  message: string;
}

const messageSchema: Schema = new Schema({
  senderId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  recieverId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
  },
},{timestamps:true});

export const Messages: Model<Imessage> = mongoose.model<Imessage>(
  "Messages",
  messageSchema
);
