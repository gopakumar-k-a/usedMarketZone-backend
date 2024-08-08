import mongoose, { Document, Model, Schema, mongo } from "mongoose";

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
}

const conversationSchema: Schema = new Schema({
  participants: [{ type: mongoose.Types.ObjectId, default: [],ref:'User' }],

  messages: [{ type: mongoose.Types.ObjectId, default: [],ref:'Messages' }],
},{timestamps:true});

export const Conversation:Model<IConversation> = mongoose.model<IConversation>("Conversation", conversationSchema);
