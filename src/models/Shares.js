import mongoose from "mongoose";

const sharesListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
  },
  createdAt: {
    type: Date
  },
});

const ShareSchema = new mongoose.Schema({
  post: {
    type: mongoose.Types.ObjectId,
  },
  shareslist: {
    type: [sharesListSchema]
  }
});

const Shares = mongoose.model("Shares", ShareSchema);

export default Shares;