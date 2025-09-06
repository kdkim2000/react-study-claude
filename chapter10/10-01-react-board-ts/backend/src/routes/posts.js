const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { validatePost, validatePagination } = require('../middleware/validation');

// GET /api/posts?page=0&size=10 - 게시글 목록 조회 (페이지네이션)
router.get('/', validatePagination, postController.getPosts);

// GET /api/posts/:id - 게시글 상세 조회
router.get('/:id', postController.getPostById);

// POST /api/posts - 게시글 작성
router.post('/', validatePost, postController.createPost);

// PUT /api/posts/:id - 게시글 수정
router.put('/:id', validatePost, postController.updatePost);

// DELETE /api/posts/:id - 게시글 삭제
router.delete('/:id', postController.deletePost);

module.exports = router;