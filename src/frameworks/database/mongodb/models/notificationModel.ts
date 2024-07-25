import mongoose, { Schema, Document, Types } from 'mongoose';
import { IProduct } from './productModel';
import { Imessage } from './messageModel';
import { IBid } from './bidModel';
import { IUser } from './userModel';
// Define the interface for the notification document
// interface NotificationDocument extends Document {
//   notificationType: 'comment' | 'bid' | 'message'; // Enum for different types of notifications
//   postId?: mongoose.Schema.Types.ObjectId; // Optional, since not all notifications will have a postId
//   messageId?: mongoose.Schema.Types.ObjectId; // Optional, since not all notifications will have a messageId
//   bidId?: mongoose.Schema.Types.ObjectId; // Optional, reference to the Bid model
//   senderId: mongoose.Schema.Types.ObjectId;
//   receiverId: mongoose.Schema.Types.ObjectId;
//   status: 'read' | 'unread'; // Status of the notification
//   additionalInfo?: string; // Optional, any additional information
//   priority?: 'low' | 'medium' | 'high'; // Priority of the notification
// }

interface NotificationDocument extends Document {
  notificationType: 'comment' | 'bid' | 'message'|'follow';
  postId?: Types.ObjectId | IProduct;
  messageId?: Types.ObjectId | Imessage;
  bidId?: Types.ObjectId | IBid;
  senderId: Types.ObjectId | IUser;
  receiverId: Types.ObjectId | IUser;
  status: 'read' | 'unread';
  additionalInfo?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}


// Create the schema for the notification
const NotificationSchema: Schema = new Schema(
  {
    notificationType: {
      type: String,
      enum: ['comment', 'bid', 'message','follow'], // Enum to restrict the types of notifications
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post', // Assuming you have a Post model
      required: function (this: NotificationDocument) {
        return this.notificationType === 'comment'; // postId is required only for comment notifications
      },
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Messages', // Assuming you have a Message model
      required: function (this: NotificationDocument) {
        return this.notificationType === 'message'; // messageId is required only for message notifications
      },
    },
    bidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bid', // Assuming you have a Bid model
      required: function (this: NotificationDocument) {
        return this.notificationType === 'bid'; // bidId is required only for bid notifications
      },
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: true,
    },
    status: {
      type: String,
      enum: ['read', 'unread'], // Enum to restrict the status values
      default: 'unread',
      required: true,
    },
    additionalInfo: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'], // Enum to restrict the priority values
      default: 'medium',
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt timestamps
  }
);

// Create and export the model
const Notification = mongoose.model<NotificationDocument>('Notification', NotificationSchema);

export default Notification;
