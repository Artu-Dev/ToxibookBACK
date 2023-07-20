import mongoose from "mongoose";
import { getUserByIdService } from "../services/user.service.js";

export const validId = (req, res, next) => {
  const { id } = req.params;
  if(!id) return resMessage(res, 400, "Nao foi encontrado nenhum ID");
  
  const isValid = mongoose.isValidObjectId(id);
  if(!isValid) return resMessage(res, 401, "ID invalido");
  
  req.id = id;
  next();
}

export const UserActionsVerify = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await getUserByIdService(userId);

    if(!user.canComment) return resMessage(res, 401, "Você não pode comentar!");
    if(!user.canLike) return resMessage(res, 401, "Você não pode dar Like!");
    if(!user.canPost) return resMessage(res, 401, "Você não pode dar Postar!");

    next();
  } catch (error) {
    return resMessage(res, 500, error.message);
  }
}

function resMessage(res, code, message) {
  return res.status(code).send({message: message});
}