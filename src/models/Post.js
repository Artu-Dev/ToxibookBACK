import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true
  },
  textContent: {
    type: String,
    maxLength: 4001
  },
  imageContent: {
    type: String
  },
  isCommentOf: {
    type: mongoose.Types.ObjectId,
    ref: "posts"
  },
  isShareOf: {
    type: mongoose.Types.ObjectId,
    ref: "posts"
  },
  shares: {
    type: mongoose.Types.ObjectId,
    ref: "Shares"
  },
  totalShares: {
    type: Number,
    default: 0
  },
  canComment: {
    type: Boolean,
    default: true
  },
  likes: {
    type: mongoose.Types.ObjectId,
    ref: "likes"
  },
  totalLikes: {
    type: Number,
    default: 0
  },
  comments: {
    type: mongoose.Types.ObjectId,
    ref: "posts"
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  editedAt: {
    type: Date,
  },
});

const Post = mongoose.model("posts", PostSchema);

export default Post;