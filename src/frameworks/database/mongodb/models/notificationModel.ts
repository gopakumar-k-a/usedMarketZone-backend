import mongoose, { Schema, Document, Types } from "mongoose";
import { IProduct } from "./productModel";
import { Imessage } from "./messageModel";
import { IBid } from "./bidModel";
import { IUser } from "./userModel";

interface NotificationDocument extends Document {
  notificationType:
    | "comment"
    | "outBid"
    | "bidWin"
    | "bidLose"
    | "message"
    | "follow";
  postId?: Types.ObjectId | IProduct;
  messageId?: Types.ObjectId | Imessage;
  bidId?: Types.ObjectId | IBid;
  senderId: Types.ObjectId | IUser;
  receiverId: Types.ObjectId | IUser;
  status: "read" | "unread";
  additionalInfo?: string;
  priority?: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

// COMMENT = "comment",
// OUTBID = "outBid",
// BIDWIN = "bidWin",
// BIDLOSE = "bidLose",
// MESSAGE = "message",
// FOLLOW = "follow",
const NotificationSchema: Schema = new Schema(
  {
    notificationType: {
      type: String,
      enum: ["comment", "outBid", "bidWin", "bidLose", "message", "follow"],
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: function (this: NotificationDocument) {
        return this.notificationType === "comment";
      },
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages", // Assuming you have a Message model
      required: function (this: NotificationDocument) {
        return this.notificationType === "message";
      },
    },
    bidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bid", // Assuming you have a Bid model
      required: function (this: NotificationDocument) {
        return (
          this.notificationType === "outBid" ||
          this.notificationType === "bidWin" ||
          this.notificationType === "bidLose"
        );
      },
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["read", "unread"],
      default: "unread",
      required: true,
    },
    additionalInfo: {
      type: String,
      default: "",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model<NotificationDocument>(
  "Notification",
  NotificationSchema
);

export default Notification;
