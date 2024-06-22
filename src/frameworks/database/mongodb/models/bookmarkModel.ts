import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  posts: [{
    type: mongoose.Types.ObjectId,
    ref: "Post",
    required: true
  }],
}, { timestamps: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;
