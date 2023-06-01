import { getUserByIdService } from "../services/user.service.js";

export const validUserCreateDatas = async (req, res, next) => {
  const { username, email, password } = req.body;
  if(!username || !email || !password) return resMessage(res, 400, "Preencha todos os campos corretamente");

  next();
}

export const isYourProfile = async (req, res, next) => {
  const userId = req.userId; 
  const { id } = req.params ;
  if(!id || !userId) return resMessage(res, 401, "Você nao tem permissão para efetuar essa ação");

  const user = await getUserByIdService(id);
  if(!user) return resMessage(res, 404, "Usuario não encontrado");

  if(id !== userId) return resMessage(res, 401, "Você nao tem permissão para efetuar essa ação");

  next();
}

function resMessage(res, code, message) {
  return res.status(code).send({message: message});
}