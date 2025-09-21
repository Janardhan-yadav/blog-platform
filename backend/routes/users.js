const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getUserProfile,
  updateProfile,
  getUserPosts,
  getBookmarkedPosts
} = require('../controllers/userController');

// @route   GET /api/users/:id
router.get('/:id', getUserProfile);

// @route   PUT /api/users/profile
router.put('/profile', auth, updateProfile);

// @route   GET /api/users/:id/posts
router.get('/:id/posts', getUserPosts);

// @route   GET /api/users/bookmarks
router.get('/bookmarks', auth, getBookmarkedPosts);

module.exports = router;