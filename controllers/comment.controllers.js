const Comment = require('../models/comment.schema');

exports.createComment = async (req, res) => {
  try {
    const { text, author, post } = req.body;
    const newComment = new Comment({ text, author, post });
    await newComment.save();
    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getAllComments = async (req, res) => {};
exports.getCommentById = async (req, res) => {};
exports.updateCommentById = async (req, res) => {};
exports.deleteCommentById = async (req, res) => {};
