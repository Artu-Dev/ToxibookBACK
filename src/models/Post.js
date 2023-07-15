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
  likesList: {
    type: Array,
    select: false
  },
  comments: {
    type: Array
  },
  sharesList: {
    type: Array,
    select: false
  },
  totalLikes: {
    type: Number,
    default: 0
  },
  totalComments: {
    type: Number, 
    default: 0
  },
  totalShares: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  permissions: {
    type: mongoose.Types.ObjectId,
    ref: "postPerms"
  },
  editedAt: {
    type: Date,
  },
});

const Post = mongoose.model("posts", PostSchema);

export default Post;