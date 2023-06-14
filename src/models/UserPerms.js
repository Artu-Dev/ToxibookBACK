import mongoose from "mongoose";

const userPermsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user"
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
  Mod: {
    type: Boolean,
    default: false
  },
});

const UserPerms = mongoose.model("userPerms", userPermsSchema);

export default UserPerms;