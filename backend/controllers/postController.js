const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { postValidation } = require('../utils/validation');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { error } = postValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { title, content, tags, imageUrl } = req.body;

    const post = new Post({
      title,
      content,
      tags: tags || [],
      imageUrl,
      author: req.user._id
    });

    await post.save();
    await post.populate('author', 'name profilePicture');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all posts (feed)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const tag = req.query.tag;
    const search = req.query.search;

    let query = {};

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Add user interaction info if authenticated
    if (req.user) {
      const user = await User.findById(req.user._id);
      posts.forEach(post => {
        post._doc.isLiked = user.likedPosts.includes(post._id);
        post._doc.isBookmarked = user.bookmarkedPosts.includes(post._id);
      });
    }

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasMore: skip + posts.length < total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profilePicture bio');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Add user interaction info if authenticated
    if (req.user) {
      const user = await User.findById(req.user._id);
      post._doc.isLiked = user.likedPosts.includes(post._id);
      post._doc.isBookmarked = user.bookmarkedPosts.includes(post._id);
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    const { error } = postValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    const { title, content, tags, imageUrl } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, tags: tags || [], imageUrl },
      { new: true, runValidators: true }
    ).populate('author', 'name profilePicture');

    res.json({
      success: true,
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await Post.findByIdAndDelete(req.params.id);
    
    // Delete all comments for this post
    await Comment.deleteMany({ postId: req.params.id });

    // Remove from users' liked and bookmarked posts
    await User.updateMany(
      { $or: [{ likedPosts: req.params.id }, { bookmarkedPosts: req.params.id }] },
      { $pull: { likedPosts: req.params.id, bookmarkedPosts: req.params.id } }
    );

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Like/Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const isLiked = user.likedPosts.includes(post._id);

    if (isLiked) {
      // Unlike
      user.likedPosts.pull(post._id);
      post.likes.pull(req.user._id);
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      // Like
      user.likedPosts.push(post._id);
      post.likes.push(req.user._id);
      post.likesCount += 1;
    }

    await Promise.all([user.save(), post.save()]);

    res.json({
      success: true,
      message: isLiked ? 'Post unliked' : 'Post liked',
      isLiked: !isLiked,
      likesCount: post.likesCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Bookmark/Unbookmark a post
// @route   PUT /api/posts/:id/bookmark
// @access  Private
const toggleBookmark = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const isBookmarked = user.bookmarkedPosts.includes(post._id);

    if (isBookmarked) {
      // Remove bookmark
      user.bookmarkedPosts.pull(post._id);
    } else {
      // Add bookmark
      user.bookmarkedPosts.push(post._id);
    }

    await user.save();

    res.json({
      success: true,
      message: isBookmarked ? 'Bookmark removed' : 'Post bookmarked',
      isBookmarked: !isBookmarked
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  toggleBookmark
};