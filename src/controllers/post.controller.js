import { likePostService, createPostService, deletePostService, getAllPostsService, getPostByIdService, updatePostService, deleteLikePostService, getTrendingPostsService, getLikeDetailsService, getLikesService } from "../services/post.service.js";


export const createPost = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      textContent,
      imageContent,
      isCommentOf,
      isShareOf,

      canComment,
      privatePost,
    } = req.body;

    const post = await createPostService(      
      userId,
      textContent,
      imageContent,
      isCommentOf,
      isShareOf,

      canComment,
      privatePost,
    );

    res.send(post);
  } catch (error) {
    res.status(500).send({message: error.message});
  }
}

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { textContent } = req.body;
    if(!textContent) return res.status(400).send({message: "Preencha os dados corretamente"});

    const post = await updatePostService( id, textContent );

    res.send(post);
  } catch (error) {
    res.status(500).send({message: error.message});
  }
}

export const deletePost = async (req, res) => {
  try {
    const {id} = req.params;
    const userId = req.userId;

    const deletedPost = await deletePostService(id, userId);

    res.send(deletedPost);
  } catch (error) {
    res.status(500).send({message: error.message});
  }
}

export const getAllPosts = async (req, res) => {
  try {
    const userId = req.userId;
    const posts = await getAllPostsService(userId);

    res.send(posts)
  } catch (error) {
    res.status(500).send({message: error.message});
  }
}

export const getTrendingPosts = async (req, res) => {
  try {
    const userId = req.userId;
    const posts = await getTrendingPostsService(userId);

    res.send(posts)
  } catch (error) {
    res.status(500).send({message: error.message});
  }
}

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await getPostByIdService(id);
    if(!post) return res.status(404).send({message: "Nenhum post com este ID encontrado"});

    res.send(post)
  } catch (error) {
    res.status(500).send({message: error.message});
  }
}

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    // const post = await getPostByIdService(postId);
    const post = await getLikesService(postId); //TESTAR
    if(!post) return res.status(404).send({message: "Postagem não encontrada!"});

    const postLiked = await likePostService(userId, postId);
    if(!postLiked) {
      await deleteLikePostService(userId, postId);
      return res.send({message: "Like removido com sucesso!", totalLikes: post.totalLikes-1});
    }
    
    return res.send({message: "Like adicionado com sucesso!", totalLikes: post.totalLikes+1})
  } catch (error) {
    res.status(500).send({message: error.message});
  }
}

export const getLikeDetails = async (req, res) => {
  try {
    const postId = req.params.id;

    const likesDetails = await getLikeDetailsService(postId);
    if(!likesDetails || likesDetails.length === 0) return res.status(404).send({message: "Postagem não encontrada!"});

    const totalLikes = await getLikesService(postId); 
    
    res.send(likesDetails);
  } catch (error) {
    res.status(500).send({message: error.message});
  }
}