import mongoose from "mongoose";

const likeListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date
  },
});

const LikeSchema = new mongoose.Schema({
  post: {
    type: mongoose.Types.ObjectId,
  },
  likesList: {
    type: [likeListSchema]
  },
});

const Likes = mongoose.model("likes", LikeSchema);

export default Likes;