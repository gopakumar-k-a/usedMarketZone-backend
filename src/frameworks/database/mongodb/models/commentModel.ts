import mongoose, { Document, Model, Schema } from "mongoose";

export interface IComment extends Document {
    content: string;
    author: mongoose.Schema.Types.ObjectId;
    post: mongoose.Schema.Types.ObjectId;
    parentCommentId?: mongoose.Schema.Types.ObjectId | null;
    replies: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
  }
const commentSchema: Schema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post", 
      required: true,
    },
    parentCommentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
      },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment", 
      },
    ],
  },
  { timestamps: true }
);

const Comment:Model<IComment> = mongoose.model<IComment>("Comment", commentSchema);
export default Comment
