import mongoose, { Schema } from "mongoose";

const bookmarkSchema: Schema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  postIds: [{
    type: mongoose.Types.ObjectId,
    ref: "Post",
    required: true
  }],
}, { timestamps: true });

// Check if the model already exists before defining it
const Bookmark = mongoose.models.Bookmark || mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;
