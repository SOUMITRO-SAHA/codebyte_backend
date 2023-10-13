const Comment = require('../models/comment.schema');

exports.createComment = async (req, res) => {
  try {
    const { text, post } = req.body;
    const newComment = new Comment({ text, author: req.user._id, post });
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

exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate('author');
    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getCommentById = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findById(id).populate('author');
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }
    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.updateCommentById = async (req, res) => {
  const { id } = req.params;
  const updateObject = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(id, updateObject, {
      new: true,
    });

    if (!updatedComment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    res.status(200).json({
      success: true,
      comment: updatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.deleteCommentById = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Comment deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
