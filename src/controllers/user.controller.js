import { createUserService, deleteUserService, followUserService, getAllUsersService, getUserByIdService, getUserByTermService, getUserDatasByIdService, unfollowUserService, updateUserService } from "../services/user.service.js";

export const createUser = async (req, res) => {
  try {
    const { username, email, password, bio, tag} = req.body;
    const user = await createUserService(username, email, password, bio, tag);

    res.send(user);
  } catch (error) {
    resMessage(res, 500, error.message);
  }
}

export const updateUser = async (req, res) => {
  try {
    const id = req.userId;
    const { bio, profileImg, bannerImg, username } = req.body;
    if(!bio || !profileImg || !bannerImg || !username) resMessage(res, 400, "Preencha todos os campos corretamente");

    const updatedUser = await updateUserService(id, bio, profileImg, bannerImg, username);

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