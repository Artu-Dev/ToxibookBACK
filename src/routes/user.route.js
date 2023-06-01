import { Router } from "express";
import {createUser, deleteUser, findAllUsers, findUserById, findUserByName, followUser, updateUser} from "../controllers/user.controller.js";
import { isYourProfile, validUserCreateDatas } from "../middlewares/user.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validId } from "../middlewares/global.middleware.js";
const router = Router();

router.post("/", validUserCreateDatas, createUser);
router.get("/", findAllUsers);
router.get("/:id", validId, findUserById);
router.get("/search/:username", findUserByName);

router.patch("/follow/:id", authMiddleware, validId, followUser);

router.patch("/update/:id", authMiddleware, validId, isYourProfile, updateUser);
router.delete("/delete", authMiddleware, deleteUser);



export default router