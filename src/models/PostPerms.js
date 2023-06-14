import mongoose from "mongoose";

const PostPermsSchema = new mongoose.Schema({
  post: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true
  },
  canComment: {
    type: Boolean,
    default: true
  },
  privatePost: {
    type: Boolean,
    default: false
  }
});

const PostPerms = mongoose.model("postPerms", PostPermsSchema);

export default PostPerms;