import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { getUserByIdService, getUserDatasByIdService } from "../services/user.service.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if(!authorization) return res.status(401).send("Authorization não encontrado!");

    const parts = authorization.split(" ");
    const [schema, token] = parts;

    if(schema !== "Bearer" || parts.length !== 2) return res.status(401).send("Authorization invalido!");

    jwt.verify(token, process.env.SECRET_JWT, async(error, decoded) => {
      if(error) return res.status(401).send({message: "Token invalido"});

      const user = await getUserDatasByIdService(decoded.id);
      if(!user) return res.status(404).send({message: "Usuario nao encontrado"});

      req.userId = decoded.id;
      return next();
    })

  } catch (error) {
    res.status(500).send({message: error.message});
  }
} 

export const checkLogin = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if(!authorization) return next();

    const parts = authorization.split(" ");
    const [schema, token] = parts;

    if(schema !== "Bearer" || parts.length !== 2) return next();

    jwt.verify(token, process.env.SECRET_JWT, async(error, decoded) => {
      if(error) return next();

      const user = await getUserByIdService(decoded.id);
      if(!user) return next();

      req.userId = decoded.id;

      return next();
    })

  } catch (error) {
    res.status(500).send({message: error.message});
  }
}
