import mongoose, { Schema } from "mongoose";

const postReportSchema: Schema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    reasonType: {
      type: String,
      required: true,
    },
    actionTaken: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const PostReport=mongoose.model('PostReport',postReportSchema)
export default PostReport