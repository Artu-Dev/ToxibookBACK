import Post from "../models/Post.js";
import User from "../models/User.js";
import PostPerms from "../models/PostPerms.js";

export const createPostService = async (
  userId,
  textContent,
  imageContent,
  isCommentOf,
  isShareOf,
  ImageKey,
  canComment = true,
  privatePost = false,
) => {
  const post = await Post.create({
    user: userId,
    textContent,
    imageContent,
    ImageKey,
    isCommentOf,
    isShareOf,
  });

  const permissions = await PostPerms.create({
    post: post._id,
    canComment,
    privatePost,
  });

  if(isShareOf) {
    await Post.findByIdAndUpdate(isShareOf, 
      { 
        $inc: { totalShares: 1 },
        $push: { sharesList: post._id }
      }
    );
  };

  if(isCommentOf) {
    await Post.findByIdAndUpdate(isCommentOf, 
      { 
        $inc: { totalComments: 1 },
        $push: { comments: post._id }
      }
    );
  };

  await User.findByIdAndUpdate(userId, { $push: { posts: post._id } });

  return Post.findByIdAndUpdate(post._id, 
    {permissions},
    {new: true}
  )
  .populate({
    path: "user",
    select: "username profileImg tag verified"
  })
  .populate({ 
    path: "isCommentOf",
    strictPopulate: false,
    select: "user",
    populate: {
      path: "user",
      select: "tag"
    }
  })
  .populate({ 
    path: "isShareOf",
    strictPopulate: false,
    select: "user textContent imageContent createdAt",
    populate: {
      path: "user",
      select: "username tag profileImg verified"
    }
  })
  .populate({ 
    path: "permissions",
    select: "canComment privatePost"
  });
};

export const getTrendingPostsService = async (userId) => {
  const posts = await Post.find()
  .sort({totalLikes: -1})
  .select("+likesList")
  .populate({
    path: "user",
    select: "username profileImg tag verified"
  })
  .populate({ 
    path: "isCommentOf",
    strictPopulate: false,
    select: "user",
    populate: {
      path: "user",
      select: "tag"
    }
  })
  .populate({ 
    path: "isShareOf",
    strictPopulate: false,
    select: "user textContent imageContent createdAt",
    populate: {
      path: "user",
      select: "username tag profileImg verified"
    }
  })
  .populate({ 
    path: "permissions",
    select: "canComment privatePost"
  })
  .limit(10);

  const likedPostsIds = [];
  const isYourPost = [];
  
  for (const post of posts) {
    if(post.likesList.includes(userId)) {
      likedPostsIds.push(post._id);
    }
    if(post._id === userId) {
      isYourPost.push(post._id);
    }
  }

  return {
    likedPostsIds,
    isYourPost,
    posts
  }
}

export const getSearchPostsService = async (userId, param) => {
  const posts = await Post.find({
    $or: [
      {textContent: {$regex: param, $options: "i"}},
    ]
  })
  .select("+likesList")
  .populate({
    path: "user",
    select: "username profileImg tag verified"
  })
  .populate({ 
    path: "isCommentOf",
    strictPopulate: false,
    select: "user",
    populate: {
      path: "user",
      select: "tag"
    }
  })
  .populate({ 
    path: "isShareOf",
    strictPopulate: false,
    select: "user textContent imageContent createdAt",
    populate: {
      path: "user",
      select: "username tag profileImg verified"
    }
  })
  .populate({ 
    path: "permissions",
    select: "canComment privatePost"
  })
  .limit(10);
  
  const likedPostsIds = [];
  const isYourPost = [];
  
  for (const post of posts) {
    if(post.likesList.includes(userId)) {
      likedPostsIds.push(post._id);
    }
    if(post._id === userId) {
      isYourPost.push(post._id);
    }
  }

  return {
    likedPostsIds,
    isYourPost,
    posts
  }
}

export const getAllPostsService = async (userId) => { 
  const posts = await Post.find()
  .sort({_id: -1})
  .select("+likesList")
  .populate({
    path: "user",
    select: "username profileImg tag verified"
  })
  .populate({ 
    path: "isCommentOf",
    strictPopulate: false,
    select: "user",
    populate: {
      path: "user",
      select: "tag"
    }
  })
  .populate({ 
    path: "isShareOf",
    strictPopulate: false,
    select: "user textContent imageContent createdAt",
    populate: {
      path: "user",
      select: "username tag profileImg verified"
    }
  })
  .populate({ 
    path: "permissions",
    select: "canComment privatePost"
  })
  .limit(10);

  const likedPostsIds = [];
  const isYourPost = [];
  
  for (const post of posts) {
    if(post.likesList.includes(userId)) {
      likedPostsIds.push(post._id);
    }
    if(post._id === userId) {
      isYourPost.push(post._id);
    }
  }

  return {
    likedPostsIds,
    isYourPost,
    posts
  }
}

export const getPostByIdService = async (id, userId) => {
  const postQuery = Post.findById(id)  
  .populate({
    path: "user",
    select: "username profileImg tag verified"
  })
  .populate({ 
    path: "comments",
    strictPopulate: false,
    select: "user textContent imageContent"
  })
  .populate({ 
    path: "isCommentOf",
    strictPopulate: false,
    select: "user",
    populate: {
      path: "user",
      select: "tag"
    }
  })
  .populate({ 
    path: "isShareOf",
    strictPopulate: false,
    select: "user textContent imageContent createdAt",
    populate: {
      path: "user",
      select: "username tag profileImg verified"
    }
  })
  .populate({ 
    path: "permissions",
    select: "canComment privatePost"
  })
  .limit(10);

  const isLikedQuery = Post.find({likesList: userId, _id: id}, {_id: 1}).lean();

  const [post, isLiked] = await Promise.all([postQuery, isLikedQuery])

  return {isLiked, post} 
};

export const getPostsByUserService = (userID) => Post.find({user: userID, isCommentOf: { $exists: false } })  
.sort({_id: -1})  
.populate({
  path: "user",
  select: "username profileImg tag verified"
})
.populate({ 
  path: "isCommentOf",
  strictPopulate: false,
  select: "user",
  populate: {
    path: "user",
    select: "tag"
  }
})
.populate({ 
  path: "isShareOf",
  strictPopulate: false,
  select: "user textContent imageContent createdAt",
  populate: {
    path: "user",
    select: "username tag profileImg verified"
  }
})
.populate({ 
  path: "permissions",
  select: "canComment privatePost"
});

export const getReplysByUserService = (userID) => Post.find({user: userID, isCommentOf: { $exists: true, $ne: null } })  
.sort({_id: -1})  
.populate({
  path: "user",
  select: "username profileImg tag verified"
})
.populate({ 
  path: "isCommentOf",
  strictPopulate: false,
  select: "user",
  populate: {
    path: "user",
    select: "tag"
  }
})
.populate({ 
  path: "isShareOf",
  strictPopulate: false,
  select: "user textContent imageContent createdAt",
  populate: {
    path: "user",
    select: "username tag profileImg verified"
  }
})
.populate({ 
  path: "permissions",
  select: "canComment privatePost"
});

export const updatePostService = (id, textContent) => Post.findByIdAndUpdate(id, 
  { textContent, editedAt: Date.now() },
  { new: true })
  .populate({
    path: "user",
    select: "username profileImg tag verified"
  })
  .populate({
    path: "likes",
    select: "totalLikes"
});

export const deletePostService = async (id) =>  Post.findOneAndDelete({_id: id});

export const likePostService = async (userId, postId) => Post.findOneAndUpdate(
    { _id: postId, likesList: { $nin: [userId] } },
    {
      $push: { likesList: userId },
      $inc: { totalLikes: 1 } 
    }
);

export const getLikesService = (postId) => Post.findById(postId).select("totalLikes -_id"); // falta TESTAR 

export const deleteLikePostService = async (userId, postId) => Post.findByIdAndUpdate(postId,
  {
    $pull: { likesList: userId },
    $inc: { totalLikes: -1 } 
  }
);

export const getLikeDetailsService = (postId) => Likes.find({post: postId});

export const updateShareService = (id) => Likes.findByIdAndUpdate(id, {});
