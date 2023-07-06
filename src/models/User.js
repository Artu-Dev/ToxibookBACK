import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    unique: true,
    required: true
  },
  bio: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    select: false
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  profileImg: {
    type: String,
  },
  bannerImg: {
    type: String,
  },
  canComment: {
    type: Boolean,
    default: true
  },
  canPost: {
    type: Boolean,
    default: true
  },
  canLike: {
    type: Boolean,
    default: true
  },
  followInfo: {
    type: mongoose.Types.ObjectId,
    ref: "follow"
  },
  posts: {
    type: Array,
    select: false
  },
  totalPosts: {
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function(next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("user", userSchema);

export default User;