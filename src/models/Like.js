import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user"
	},
	postId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "posts",
	},
	timestamp: {
		type: Date,
		default: Date.now
	}
})

const Like = mongoose.model("like", LikeSchema);

export default Like;