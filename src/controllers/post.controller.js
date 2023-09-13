import { likePostService, createPostService, deletePostService, getAllPostsService, getPostByIdService, updatePostService, getTrendingPostsService, getLikeDetailsService, getLikesService, getPostsByUserService, getReplysByUserService, getSearchPostsService, getCommentsService, getPostsLikedByUserService } from "../services/post.service.js";


export const createPost = async (req, res) => {
  try {
    // const {location: imageContent, key: ImageKey} = req.file;
    const imageContent = req.file?.location;
    const ImageKey = req.file?.key;
    
    const userId = req.userId;
    const {
      textContent,
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
      ImageKey,
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
    const {skip, itensPerPage} = paginate(req, 10)

    const userId = req.userId;
    const posts = await getAllPostsService(userId, itensPerPage, skip);

    res.send(posts)
  } catch (error) {
    res.status(500).send({message: error.message});
  }
}

export const getTrendingPosts = async (req, res) => {
  try {
    const {skip, itensPerPage} = paginate(req, 10)
    
    const userId = req.userId;
    const posts = await getTrendingPostsService(userId, itensPerPage, skip);
    res.send(posts)
  } catch (error) {
    res.status(500).send({message: error.message});
  }
}

export const getComments = async (req, res) => {
  try {
    const {skip, itensPerPage} = paginate(req, 10)

    const userId = req.userId;
    const {id} = req.params;
    const posts = await getCommentsService(userId, id, itensPerPage, skip);

    res.send(posts)
  } catch (error) {
    res.status(500).send({message: error.message});
  }
}

export const getSearchPosts = async (req, res) => {
  try {
    const userId = req.userId;
    const param = req.query.searchParam;
    if(!param) return res.status(400).send({message: "Insira um termo para pesquisar!"});
    const {skip, itensPerPage} = paginate(req, 10)

    const posts = await getSearchPostsService(userId, param, itensPerPage, skip);

    res.send(posts)
  } catch (error) {
    res.status(500).send({message: error.message});
  }
}

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; 

    const post = await getPostByIdService(id, userId);
    if(!post) return res.status(404).send({message: "Nenhum post com este ID encontrado"});

    res.send(post)
  } catch (error) {
    res.status(500).send({message: error.message});
  }
}

export const getPostsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {skip, itensPerPage} = paginate(req, 10)

    const posts = await getPostsByUserService(id, itensPerPage, skip);
    if(!posts) return res.status(404).send({message: "Nenhum post desse usuario encontrado"});

    res.send(posts);
  } catch (error) {
    res.status(500).send({message: error.message});
  }
}

export const getReplysByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {skip, itensPerPage} = paginate(req, 10)

    const posts = await getReplysByUserService(id, itensPerPage, skip);
    if(!posts) return res.status(404).send({message: "Nenhum post desse usuario encontrado"});

    res.send(posts);
  } catch (error) {
    res.status(500).send({message: error.message});
  }
}

export const getPostsLikedByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {skip, itensPerPage} = paginate(req, 10)

    const posts = await getPostsLikedByUserService(id, itensPerPage, skip);
    if(!posts) return res.status(404).send({message: "O usuario não curtiu nenhuma postagem"});

    res.send(posts);
  } catch (error) {
    res.status(500).send({message: error.message});
  }
}

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    const {skip, itensPerPage} = paginate(req, 10)

    const post = await getLikesService(postId, itensPerPage, skip);
    if(!post) return res.status(404).send({message: "Postagem não encontrada!"});

    const totalLikes = await likePostService(userId, postId);
    
    return res.send({message: "sucesso!", totalLikes})
  } catch (error) {
    res.status(500).send({message: error.message});
  }
}

export const getLikeDetails = async (req, res) => {
  try {
    const postId = req.params.id;
    const {skip, itensPerPage} = paginate(req, 10) 

    const likesDetails = await getLikeDetailsService(postId, skip, itensPerPage);
    if(!likesDetails || likesDetails.length === 0) return res.status(404).send({message: "Postagem não encontrada!"});

    const totalLikes = await getLikesService(postId); 
    
    res.send(likesDetails);
  } catch (error) {
    res.status(500).send({message: error.message});
  }
}

function paginate(req, itensPerPage) {
  const page = parseInt(req.query.page) || 1;
  if(isNaN(page) || page < 0) return res.status(401).send({message: "Page não é um numero valido"});

  const skip = (page - 1) * itensPerPage;
  
  return {itensPerPage, skip}
}