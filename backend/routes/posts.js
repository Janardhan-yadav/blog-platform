const express = require('express');
const router = express.Router();
const { auth, optionalAuth } = require('../middleware/auth');
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  toggleBookmark
} = require('../controllers/postController');

// @route   POST /api/posts
router.post('/', auth, createPost);

// @route   GET /api/posts
router.get('/', optionalAuth, getPosts);

// @route   GET /api/posts/:id
router.get('/:id', optionalAuth, getPostById);

// @route   PUT /api/posts/:id
router.put('/:id', auth, updatePost);

// @route   DELETE /api/posts/:id
router.delete('/:id', auth, deletePost);

// @route   PUT /api/posts/:id/like
router.put('/:id/like', auth, toggleLike);

// @route   PUT /api/posts/:id/bookmark
router.put('/:id/bookmark', auth, toggleBookmark);

module.exports = router;