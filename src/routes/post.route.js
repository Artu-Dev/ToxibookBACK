import { Router } from "express";
import { authMiddleware, checkLogin } from "../middlewares/auth.middleware.js";
import { createPost, deletePost, getAllPosts, getPostById, updatePost, likePost, getTrendingPosts, getLikeDetails } from "../controllers/post.controller.js";
import { validPost, isYourPost } from "../middlewares/post.middleware.js";
import { UserActionsVerify, validId } from "../middlewares/global.middleware.js";
const route = Router();

route.post("/", authMiddleware, validPost, UserActionsVerify, createPost);
route.get("/", checkLogin, getAllPosts);
route.get("/trending",checkLogin, getTrendingPosts);
route.get("/:id", validId, getPostById);

route.patch("/like/:id", authMiddleware, validId, likePost)
route.get("/like/:id", validId, getLikeDetails);

route.patch("/edit/:id", authMiddleware, validId, isYourPost, updatePost);
route.delete("/delete/:id", authMiddleware, validId, isYourPost, deletePost);

export default route;