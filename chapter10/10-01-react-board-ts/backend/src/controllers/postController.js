const postService = require('../services/postService');

/**
 * 게시글 목록 조회 (페이지네이션)
 * GET /api/posts?page=0&size=10
 */
const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const size = parseInt(req.query.size) || 10;
    
    console.log(`📄 Getting posts: page=${page}, size=${size}`);
    
    const result = await postService.getPosts(page, size);
    
    res.json({
      content: result.posts,
      totalElements: result.totalCount,
      totalPages: Math.ceil(result.totalCount / size),
      size: size,
      number: page,
      first: page === 0,
      last: page >= Math.ceil(result.totalCount / size) - 1
    });
  } catch (error) {
    console.error('❌ Error in getPosts:', error);
    next(error);
  }
};

/**
 * 게시글 상세 조회
 * GET /api/posts/:id
 */
const getPostById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: '유효하지 않은 게시글 ID입니다.',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`📖 Getting post by ID: ${id}`);
    
    const post = await postService.getPostById(id);
    
    if (!post) {
      return res.status(404).json({
        error: 'Not Found',
        message: '게시글을 찾을 수 없습니다.',
        timestamp: new Date().toISOString()
      });
    }
    
    res.json(post);
  } catch (error) {
    console.error('❌ Error in getPostById:', error);
    next(error);
  }
};

/**
 * 게시글 작성
 * POST /api/posts
 */
const createPost = async (req, res, next) => {
  try {
    const { title, content, author } = req.body;
    
    console.log('✏️ Creating new post:', { title, author });
    
    const newPost = await postService.createPost({ title, content, author });
    
    res.status(201).json(newPost);
  } catch (error) {
    console.error('❌ Error in createPost:', error);
    next(error);
  }
};

/**
 * 게시글 수정
 * PUT /api/posts/:id
 */
const updatePost = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;
    
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: '유효하지 않은 게시글 ID입니다.',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`📝 Updating post ID: ${id}`);
    
    // 게시글 존재 확인
    const existingPost = await postService.getPostById(id);
    if (!existingPost) {
      return res.status(404).json({
        error: 'Not Found',
        message: '게시글을 찾을 수 없습니다.',
        timestamp: new Date().toISOString()
      });
    }
    
    const updatedPost = await postService.updatePost(id, { title, content });
    
    res.json(updatedPost);
  } catch (error) {
    console.error('❌ Error in updatePost:', error);
    next(error);
  }
};

/**
 * 게시글 삭제
 * DELETE /api/posts/:id
 */
const deletePost = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: '유효하지 않은 게시글 ID입니다.',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`🗑 Deleting post ID: ${id}`);
    
    // 게시글 존재 확인
    const existingPost = await postService.getPostById(id);
    if (!existingPost) {
      return res.status(404).json({
        error: 'Not Found',
        message: '게시글을 찾을 수 없습니다.',
        timestamp: new Date().toISOString()
      });
    }
    
    await postService.deletePost(id);
    
    res.status(204).send();
  } catch (error) {
    console.error('❌ Error in deletePost:', error);
    next(error);
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};