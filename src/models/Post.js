import mongoose from "mongoose";
import aws from "aws-sdk";
import User from "./User.js";

const s3 = new aws.S3();

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
  ImageKey: {
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

PostSchema.pre("findOneAndDelete", async function(next) {
  try {
    const id = this.getQuery()["_id"];
    const {isShareOf, isCommentOf, imageContent, user, ImageKey} = await Post.findById(id);

    if (isShareOf) {
      const sharePost = await Post.findByIdAndUpdate(isShareOf, {
        $inc: { totalShares: -1 }
      });
      if (!sharePost) throw new Error('Post não encontrado ao atualizar total de compartilhamentos.');
    }

    if (isCommentOf) {
      const commentPost = await Post.findByIdAndUpdate(isCommentOf, {
        $inc: { totalComments: -1 }
      });
      if (!commentPost) throw new Error('Post não encontrado ao atualizar total de comentários.');
    }

    const updatedUser = await User.findByIdAndUpdate(user, { $pull: { posts: id } });
    if (!updatedUser) throw new Error('Usuário não encontrado ao remover referência do post.');
    

    if (imageContent || ImageKey) {
      if (process.env.STORAGE_TYPE === "s3") {
        await s3.deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: doc.ImageKey,
        }).promise();
      } else {
        // Add any handling for other storage types if needed
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Post = mongoose.model("posts", PostSchema);

export default Post;