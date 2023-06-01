import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  }],
  totalFollowers: {
    type: Number,
    default: 0,
    min: 0
  },
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  }],
  totalFollowing: {
    type: Number,
    default: 0,
    min: 0
  },
});

const Follow = mongoose.model("follow", followSchema);

export default Follow;
