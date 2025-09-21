const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  addComment,
  getComments,
  updateComment,
  deleteComment
} = require('../controllers/commentController');

// @route   POST /api/comments/:postId
router.post('/:postId', auth, addComment);

// @route   GET /api/comments/:postId
router.get('/:postId', getComments);

// @route   PUT /api/comments/:id
router.put('/:id', auth, updateComment);

// @route   DELETE /api/comments/:id
router.delete('/:id', auth, deleteComment);

module.exports = router;