import Follow from "../models/Follow.js";
import User from "../models/User.js";

export const createUserService = async ( username, email, password, bio, tag, profileImg, bannerImg) => {
  const user = await User.create({
    username,
    email,
    password,
    bio,
    tag,
    profileImg,
    bannerImg
  });

  const follow = await Follow.create({ user: user._id });

  return User.findByIdAndUpdate(user._id, 
    { followInfo: follow._id },
    { new: true }
  );
};

export const updateUserService = (id, bio, profileImg, bannerImg, username) => User.findByIdAndUpdate(id, {
  bio, profileImg, bannerImg, username
}, {new: true});

export const deleteUserService = async (id) => {
  await Follow.findOneAndDelete({user: id});

  return User.findByIdAndDelete(id);
};

export const getAllUsersService = () => User.findAll();

export const getUserByIdService = (id) => User.findById(id)
  .populate("followInfo").select("+posts"); 
  
export const getUserDatasByIdService = (id) => User.findById(id); 

export const getUserByTermService = (term) => User.find({
    $or: [
      { username: { $regex: term, $options: 'i' } },
      { bio: { $regex: term, $options: 'i' } },
    ]
});

export const followUserService = async (userId, followUserId) => {
  await Follow.findOneAndUpdate(
    { user: followUserId, followers: { $nin: [userId] } },
    { 
      $push: { followers: userId },
      $inc: { totalFollowers: 1 }
    },
  );  

  return Follow.findOneAndUpdate(
    { user: userId, following: { $nin: [followUserId] } },
    { 
      $push: { following: followUserId } ,
      $inc: { totalFollowing: 1 }
    },
  );
}

export const unfollowUserService = async (userId, followUserId) => {
  try {
    await Follow.findOneAndUpdate(
      { user: followUserId, followers: { $in: [userId] } },
      { 
        $pull: { followers: userId },
        $inc: { totalFollowers: -1 }
      },
    );  
  
    return Follow.findOneAndUpdate(
      { user: userId, following: { $in: [followUserId] } },
      { 
        $pull: { following: followUserId } ,
        $inc: { totalFollowing: -1 }
      },
    );
    
  } catch (error) {
    throw new Error({ message: "Houve um problema ao tentar deixar de seguir esse usuario!" });
  }
}