const Like = require('../models/like.schema');

// Like a post
exports.likePost = async (req, res) => {
  try {
    const { user, post } = req.body;
    const newLike = new Like({ user, post });
    await newLike.save();
    res.status(201).json({
      success: true,
      message: 'Post liked successfully',
      like: newLike,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const { user, post } = req.body;
    const deletedLike = await Like.findOneAndDelete({ user, post });
    if (!deletedLike) {
      return res
        .status(404)
        .json({ success: false, message: 'Like not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Post unliked successfully',
      like: deletedLike,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
