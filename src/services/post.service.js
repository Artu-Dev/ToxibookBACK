import Post from "../models/Post.js";
import Likes from "../models/Likes.js";
import Shares from "../models/Shares.js";
import User from "../models/User.js";


export const createPostService = async (
  userId,
  textContent,
  imageContent,
  isCommentOf,
  isShareOf
) => {
  const post = await Post.create({
    user: userId,
    textContent,
    imageContent,
    isCommentOf,
    isShareOf,
  });
  const likes = await Likes.create({post: post._id});
  const shares = await Shares.create({post: post._id});

  if(isShareOf) {
    await Shares.findByIdAndUpdate(isShareOf,
      { $push: { shareslist: { user: userId, createdAt: Date.now() } } });
    await Post.findByIdAndUpdate(isShareOf, 
      { $inc: { totalShares: 1 } });
  }

  await User.findByIdAndUpdate(userId, { $push: { posts: post._id } });

  return Post.findByIdAndUpdate(post._id, 
    {likes, shares},
    {new: true}
  );
};

export const getTrendingPostsService = () => Post.find()
.sort({totalLikes: -1})  
.populate({
  path: "user",
  select: "username profileImg tag"
});

export const getAllPostsService = () => Post.find()
  .sort({_id: -1})  
  .populate({
    path: "user",
    select: "username profileImg tag"
});

export const getPostByIdService = (id) => Post.findById(id)  
  .populate({
    path: "user",
    select: "username profileImg tag"
  })
  .populate({ 
    path: "isCommentOf",
    strictPopulate: false,
    select: "user textContent imageContent"
  })
  .populate({ 
    path: "isShareOf",
    strictPopulate: false,
    select: "user textContent imageContent"
});

export const updatePostService = (id, textContent) => Post.findByIdAndUpdate(id, 
  { textContent, editedAt: Date.now() },
  { new: true })
  .populate({
    path: "user",
    select: "username profileImg tag"
  })
  .populate({
    path: "likes",
    select: "totalLikes"
});

export const deletePostService = async (id, userId) => {
  const deletedPost = await Post.findByIdAndDelete(id);
  if (deletedPost.isShareOf) {
    await Post.findByIdAndUpdate(deletedPost.isShareOf, {
      $inc: { totalShares: -1 }
    });
  };

  await Likes.findByIdAndDelete(deletedPost.likes);
  await Shares.findByIdAndDelete(deletedPost.shares);
  await User.findByIdAndUpdate(userId, { $pull: { posts: deletedPost._id } });

  return deletedPost;
};

export const likePostService = async (userId, likeId, postId) => {
  await Post.findByIdAndUpdate(postId, { $inc: { totalLikes: 1 } });

  return Likes.findOneAndUpdate(
    { _id: likeId, "likesList.user": { $nin: [userId] } },
    { $push: { likesList: { user: userId, createdAt: Date.now() } } });
};

export const deleteLikePostService = async (userId, likeId, postId) => {
  await Post.findByIdAndUpdate(postId, { $inc: { totalLikes: -2 } });

  await Likes.findByIdAndUpdate(likeId, { $pull: { likesList: { user: userId } } });
};

export const getLikeDetailsService = (postId) => Likes.find({post: postId});

export const updateShareService = (id) => Likes.findByIdAndUpdate(id, {});
