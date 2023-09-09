import { createUserService, deleteUserService, followUserService, getAllUsersService, getUserByIdService, getUserByTermService, getUserDatasByIdService, unfollowUserService, updateUserService } from "../services/user.service.js";
import deleteImage from "../util/deleteImage.js";

export const createUser = async (req, res) => {
  try {
    const { username, email, password, bio, tag, profileImg, bannerImg} = req.body;
    const user = await createUserService(username, email, password, bio, tag, profileImg, bannerImg);

    res.send(user);
  } catch (error) {
    resMessage(res, 500, error.message);
  }
}

export const updateUser = async (req, res) => {
  try {
    const id = req.userId;
    const {files} = req;
    const {profileImgKey: oldProfileImgKey, bannerImgKey: oldBannerImgKey} = await getUserByIdService(id);


    let bannerImg, bannerImgKey;
    let profileImg, profileImgKey; 
    if(process.env.STORAGE_TYPE === "s3") {
      profileImg = files?.profileImg?.[0]?.location;
      profileImgKey = files?.profileImg?.[0]?.key;
      bannerImg = files?.bannerImg?.[0]?.location;
      bannerImgKey = files?.bannerImg?.[0]?.key;
    } else {
      bannerImgKey = files?.bannerImg?.[0]?.filename;
      profileImgKey = files?.profileImg?.[0]?.filename;
      if(profileImgKey) profileImg = `${process.env.APP_URL}/files/${profileImgKey}`;
      if(bannerImgKey) bannerImg = `${process.env.APP_URL}/files/${bannerImgKey}`;
    } 

    const { bio, username } = req.body;
    if(!bio && !profileImg && !bannerImg && !username) return resMessage(res, 400, "Preencha todos os campos corretamente");
    
    if (profileImgKey) {
      deleteImage(oldProfileImgKey);
    } 
    if (bannerImgKey) {
      deleteImage(oldBannerImgKey);
    }

    const updatedUser = await updateUserService(id, bio.trim(), profileImg, profileImgKey, bannerImg, bannerImgKey, username.trim());

    res.send(updatedUser);
  } catch (error) {
    resMessage(res, 500, error.message);
  }
}

export const deleteUser = async (req, res) => {
  try {
    const id = req.userId
    const deletedUser = await deleteUserService(id);
    if(!deletedUser) return res.status(404).send({message: "Usuario não encontrado"});

    res.send({message: "Deletado com sucesso", user: deletedUser});
  } catch (error) {
    resMessage(res, 500, error.message);
  }
}

export const findAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    if(!users) return resMessage("Não há usuarios cadastrados");

    res.send(users);
  } catch (error) {
    resMessage(res, 500, error.message);
  }
}

export const findUserById = async (req, res) => {
  try {
    const id = req.id;
    if(!id) return resMessage(res, 400, "ID invalido :(");

    const user = await getUserByIdService(id);
    if(!user) return resMessage(res, 404, "Nenhum usuario com esse ID encontrado");

    res.send(user);
  } catch (error) {
    resMessage(res, 500, error.message);
  }
}

export const findUserByName = async (req, res) => {
  try {
    const { username } = req.params;
    if(!username) return resMessage(res, 400, "Insira os dados corretamente");

    const user = await getUserByTermService(username);
    if(!user || user.length === 0) return resMessage(res, 404, "Nenhum usuario encontrado");

    res.send(user);
  } catch (error) {
    resMessage(res, 500, error.message);
  }
}

export const followUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if(userId === id) return res.status(400).send({message: "Você não pode seguir você mesmo!"}) 

    const followStatus = await followUserService(userId, id); 
    if(!followStatus) {
      await unfollowUserService(userId, id);
      return res.send({message: "Parou de seguir usuario com sucesso!"});
    }

    return res.send({message: "seguiu usuario com sucesso!"})
  } catch (error) {
    return resMessage(res, 500, error.message);
  }
}

export const checkIsLoggedIn = async (req, res) => {
  try {
    const id = req.userId;
    if(!id) return resMessage(res, 400, "ID invalido :(");

    const user = await getUserDatasByIdService(id);
    if(!user) return resMessage(res, 404, "Nenhum usuario com esse ID encontrado");

    res.send(user);
  } catch (error) {
    resMessage(res, 500, error.message);
  }
}

function resMessage(res, code, message) {
  return res.status(code).send({message: message});
}