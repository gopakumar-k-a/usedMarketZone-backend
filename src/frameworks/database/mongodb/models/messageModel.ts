import mongoose, { Document, Schema, Model, mongo } from "mongoose";

export interface Imessage extends Document {
  senderId: mongoose.Types.ObjectId;
  recieverId: mongoose.Types.ObjectId;
  message: string;
  postId: mongoose.Types.ObjectId;
  isPostReply: boolean;
  isPost: boolean;
}

const messageSchema: Schema = new Schema(
  {
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
    isPost: {
      type: Boolean,
      default: false,
    },

    isPostReply: {
      type: Boolean,
      default: false,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

export const Messages: Model<Imessage> = mongoose.model<Imessage>(
  "Messages",
  messageSchema
);
