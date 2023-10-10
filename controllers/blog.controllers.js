const Post = require('../models/post.schema');

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({ title, content, author: req.user._id });
    await newPost.save();
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author')
      .populate('comments')
      .populate('likes');

    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate('author')
      .populate('comments')
      .populate('likes');

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getPostByUserId = async (req, res) => {
  try {
    const { uId } = req.query;
    console.log(uId);

    const posts = await Post.find({ author: uId });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Update a post by ID
exports.updatePostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {
      new: true,
    });
    if (!updatedPost) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Delete a post by ID
exports.deletePostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      post: deletedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
