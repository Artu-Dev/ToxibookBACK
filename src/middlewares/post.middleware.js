import mongoose from "mongoose";
import { getPostByIdService } from "../services/post.service.js";
import Post from "../models/Post.js";

export const validPost = async (req, res, next) => {
  try {
    const { textContent, imageContent, isCommentOf, isShareOf } = req.body;

    const postIds = []
    if (isCommentOf) {
      const commentPost = await Post.findById(isCommentOf)
      .populate("permissions");

      if(!commentPost.permissions.canComment) return res.status(404).send({message: "Você nao pode commentar esse post"});
      if(!commentPost) return res.status(404).send({message: "Não foi possivel encontrar o post para comentar"});
      postIds.push(isCommentOf);
    }
    if (isShareOf) {
      const sharedPost = await Post.findById(isShareOf)
      .populate("permissions");

      if(sharedPost.permissions.privatePost) return res.status(404).send({message: "Você nao pode compartilhar esse post"});
      if(!sharedPost) return res.status(404).send({message: "Não foi possivel encontrar o post para compartilhar"});
      postIds.push(isShareOf);
    }
    
    const isValidPostIds = postIds.every((item) => mongoose.isValidObjectId(item));
    if (!isValidPostIds) {
      return res.status(400).send({ message: "PostIds inválidos"});
    };

    if(!imageContent && !textContent && !isShareOf) return res.status(400).send({ message: "Preencha os campos corretamente"});

    next();
  } catch (error) {
    res.status(500).send({message: error.message})
  }
}

export const isYourPost = async (req, res, next) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;

    const {post} = await getPostByIdService(postId)
    if(!post) return res.status(404).send({message: "Postagem não encontrada!"});

    if(userId !== String(post.user._id) || !userId) return res.status(401).send({message: "Você não pode editar essa postagem!"});

    next();
  } catch (error) {
    res.status(500).send({message: error.message})
  }
}