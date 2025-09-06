const { 
  readPosts, 
  writePosts, 
  getNextId, 
  findPostById, 
  findPostIndexById 
} = require('../database/database');

/**
 * 게시글 목록 조회 (페이지네이션)
 */
const getPosts = async (page = 0, size = 10) => {
  try {
    const allPosts = await readPosts();
    
    // 최신 순으로 정렬 (createdAt 기준)
    const sortedPosts = allPosts.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    const totalCount = sortedPosts.length;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    
    const posts = sortedPosts.slice(startIndex, endIndex);
    
    return {
      posts,
      totalCount
    };
  } catch (error) {
    throw new Error(`Failed to get posts: ${error.message}`);
  }
};

/**
 * ID로 게시글 상세 조회
 */
const getPostById = async (id) => {
  try {
    const post = await findPostById(id);
    return post || null;
  } catch (error) {
    throw new Error(`Failed to get post: ${error.message}`);
  }
};

/**
 * 게시글 작성
 */
const createPost = async (postData) => {
  try {
    const { title, content, author } = postData;
    const posts = await readPosts();
    const nextId = await getNextId();
    const now = new Date().toISOString();
    
    const newPost = {
      id: nextId,
      title,
      content,
      author,
      createdAt: now,
      updatedAt: now
    };
    
    posts.push(newPost);
    await writePosts(posts);
    
    return newPost;
  } catch (error) {
    throw new Error(`Failed to create post: ${error.message}`);
  }
};

/**
 * 게시글 수정
 */
const updatePost = async (id, updateData) => {
  try {
    const { title, content } = updateData;
    const posts = await readPosts();
    const postIndex = await findPostIndexById(id);
    
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    
    // 기존 게시글 업데이트
    posts[postIndex] = {
      ...posts[postIndex],
      title,
      content,
      updatedAt: new Date().toISOString()
    };
    
    await writePosts(posts);
    return posts[postIndex];
  } catch (error) {
    throw new Error(`Failed to update post: ${error.message}`);
  }
};

/**
 * 게시글 삭제
 */
const deletePost = async (id) => {
  try {
    const posts = await readPosts();
    const postIndex = await findPostIndexById(id);
    
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    
    // 게시글 삭제
    const deletedPost = posts.splice(postIndex, 1)[0];
    await writePosts(posts);
    
    return { deletedId: id, deletedPost };
  } catch (error) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }
};

/**
 * 전체 게시글 수 조회
 */
const getTotalPostsCount = async () => {
  try {
    const posts = await readPosts();
    return posts.length;
  } catch (error) {
    throw new Error(`Failed to get total posts count: ${error.message}`);
  }
};

/**
 * 제목이나 내용으로 게시글 검색 (향후 확장용)
 */
const searchPosts = async (query, page = 0, size = 10) => {
  try {
    const allPosts = await readPosts();
    
    const filteredPosts = allPosts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.author.toLowerCase().includes(query.toLowerCase())
    );
    
    // 최신 순으로 정렬
    const sortedPosts = filteredPosts.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    const totalCount = sortedPosts.length;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    
    const posts = sortedPosts.slice(startIndex, endIndex);
    
    return {
      posts,
      totalCount,
      query
    };
  } catch (error) {
    throw new Error(`Failed to search posts: ${error.message}`);
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getTotalPostsCount,
  searchPosts
};