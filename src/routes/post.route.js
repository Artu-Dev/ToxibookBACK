import { Router } from "express";
import { authMiddleware, checkLogin } from "../middlewares/auth.middleware.js";
import { createPost, deletePost, getAllPosts, getPostById, updatePost, likePost, getTrendingPosts, getLikeDetails, getPostsByUser, getReplysByUser } from "../controllers/post.controller.js";
import { validPost, isYourPost } from "../middlewares/post.middleware.js";
import { UserActionsVerify, validId } from "../middlewares/global.middleware.js";
import { validUserId } from "../middlewares/user.middleware.js";
import multer from "multer";
import multerConfig from "../config/multer.cjs";  

const route = Router();

route.post("/", multer(multerConfig).single("imageContent"),authMiddleware, validPost, UserActionsVerify, createPost);
route.get("/", checkLogin, getAllPosts);
route.get("/trending",checkLogin, getTrendingPosts);
route.get("/:id", validId, checkLogin, getPostById);

route.patch("/like/:id", authMiddleware, validId, likePost)
route.get("/like/:id", validId, getLikeDetails);

route.get("/user/:id",validUserId, checkLogin, getPostsByUser);
route.get("/user/reply/:id",validUserId, checkLogin, getReplysByUser);

route.patch("/edit/:id", authMiddleware, validId, isYourPost, updatePost);
route.delete("/delete/:id", authMiddleware, validId, isYourPost, deletePost);

export default route;