import Post from "../models/Post.js";
import Like from "../models/Like.js";

export const createPostService = async (
  user,
  textContent,
  imageContent,
  isCommentOf,
  isShareOf,
  ImageKey,
  canComment = true,
  privatePost = false,
) => {
  const postCreated = await Post.create({
    user,
    textContent,
    imageContent,
    ImageKey,
    isCommentOf,
    isShareOf,
    permissions: {
      canComment,
      privatePost
    }
  });

  if(isShareOf) {
    await Post.findByIdAndUpdate(isShareOf, 
      { 
        $inc: { totalShares: 1 },
        $push: { sharesList: postCreated._id }
      }
    );
  };

  if(isCommentOf) {
    await Post.findByIdAndUpdate(isCommentOf, 
      { 
        $inc: { totalComments: 1 },
        $push: { comments: postCreated._id }
      }
    );
  };

  const post = await Post.findById(postCreated._id)
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
  .lean();

  post.isYourPost = true;

  return post
};

export const getTrendingPostsService = async (userId) => {
  const posts = await Post.find()
  .sort({totalLikes: -1})
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
  .lean()
  .limit(10);
  
  return await checkPostLikedOrIsYour(posts, userId);
}

export const getCommentsService = async (userId, postId) => {
  const posts = await Post.find({isCommentOf: postId})
  .sort({totalLikes: -1})
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
  .lean()
  .limit(10);

  return await checkPostLikedOrIsYour(posts, userId);
}

export const getSearchPostsService = async (userId, param) => {
  const posts = await Post.find({
    $or: [
      {textContent: {$regex: param, $options: "i"}},
    ]
  })
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
  .lean()
  .limit(10);
  
  return await checkPostLikedOrIsYour(posts, userId);
}

export const getAllPostsService = async (userId) => { 
  const posts = await Post.find()
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
  .lean()
  .limit(10);
  
  return await checkPostLikedOrIsYour(posts, userId);
}

export const getPostByIdService = async (id, userId) => {
  const postPromise = Post.findById(id)  
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
  .limit(10);

  const likePromise = Like.findOne({userId, postId: id});

  const [post, isLiked] = await Promise.all([postPromise, likePromise])

  return {isLiked, post} 
};

export const getPostsByUserService = async (userID) => {
  const posts = await Post.find({user: userID, isCommentOf: { $exists: false } })  
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
  .lean()

  return await checkPostLikedOrIsYour(posts, userID);
} 

export const getReplysByUserService = async (userID) => {
  const posts = await Post.find({user: userID, isCommentOf: { $exists: true, $ne: null } })  
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
  .lean()
  
  return await checkPostLikedOrIsYour(posts, userID);
}

export const getPostsLikedByUserService = async (userId) => {
  const likes = await Like.find({userId});
  const postIds = likes.map(like => like.postId);

  const likedPosts = await Post.find({_id: { $in: postIds }})

  return likedPosts
} 



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

export const likePostService = async (userId, postId) => {
  const like = await Like.findOne({userId, postId});

  if(!like) {
    const likePromise = Like.create({userId, postId});
    const postPromise = Post.findByIdAndUpdate(postId,
      {
        $inc: { totalLikes: 1 } 
      } 
    );
    await Promise.all([likePromise, postPromise])

  } else {
    const likePromise = Like.findOneAndDelete({userId, postId});
    const postPromise = Post.findByIdAndUpdate(postId,
      {
        $inc: { totalLikes: -1 } 
      } 
    );
    await Promise.all([likePromise, postPromise])
  }

  return await Like.countDocuments({postId})
}

export const getLikesService = (postId) => Post.findById(postId).select("totalLikes -_id"); // falta TESTAR 

export const getLikeDetailsService = (postId) => Like.find({post: postId});

// export const updateShareService = (id) => Like.findByIdAndUpdate(id, {});


async function checkPostLikedOrIsYour(posts,  userId) {
  const likePromises = posts.map(post =>
    Like.findOne({ userId, postId: post._id })
  );

  const likes = await Promise.all(likePromises);
  
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const like = likes[i];

    post.isYourPost = post.user._id.equals(userId);
    post.liked = !!like;
  }

  return posts
}