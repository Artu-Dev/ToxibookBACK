import mongoose from "mongoose";
import aws from "aws-sdk";
import User from "./User.js";
import fs from "fs"
import path from "path";
import {promisify} from "util"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const s3 = new aws.S3();

const PermsSchema = new mongoose.Schema({
  canComment: {
    type: Boolean,
    default: true
  },
  privatePost: {
    type: Boolean,
    default: false
  }
})

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
    default: Date.now
  },
  permissions: {
    type: PermsSchema,
  },
  editedAt: {
    type: Date,
  },
});

PostSchema.pre("save", function() {
  if(!this.imageContent && this.ImageKey) {
    this.imageContent = `${process.env.APP_URL}/files/${this.ImageKey}`
  }
});

PostSchema.pre("findOneAndDelete", async function(next) {
  try {
    const id = this.getQuery()["_id"];
    const {isShareOf, isCommentOf, imageContent, ImageKey} = await Post.findById(id);

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

    if (ImageKey) {
      if (process.env.STORAGE_TYPE === "s3") {
        await s3.deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: ImageKey,
        }).promise();
      } else {
        return promisify(fs.unlink)(
          path.resolve(__dirname, "..", "..", "tmp", "uploads", ImageKey)
        );
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Post = mongoose.model("posts", PostSchema);

export default Post;