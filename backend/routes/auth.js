const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  register,
  login,
  googleAuth,
  googleCallback,
  getMe
} = require('../controllers/authController');

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/google
router.get('/google', googleAuth);

// @route   GET /api/auth/google/callback
router.get('/google/callback', googleCallback);

// @route   GET /api/auth/me
router.get('/me', auth, getMe);

module.exports = router;