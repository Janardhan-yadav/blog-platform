const passport = require('passport');
const { registerValidation, loginValidation } = require('../utils/validation');
const { generateToken } = require('../utils/jwt');
const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Server error'
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: info.message || 'Invalid credentials'
        });
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user
      });
    })(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Google OAuth
// @route   GET /api/auth/google
// @access  Public
const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleCallback = (req, res) => {
  passport.authenticate('google', (err, user) => {
    if (err) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_error`);
    }

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }

    const token = generateToken(user._id);
    res.redirect(`${process.env.CLIENT_URL}/login/success?token=${token}`);
  })(req, res);
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

module.exports = {
  register,
  login,
  googleAuth,
  googleCallback,
  getMe
};