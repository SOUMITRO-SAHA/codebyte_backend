const express = require('express');
const router = express.Router();

const commentController = require('../controllers/comment.controllers');
const { isLoggedIn } = require('../middleware/auth.middleware');

// Create a new comment
router.post('/', isLoggedIn, commentController.createComment);

// Get all comments
router.get('/', commentController.getAllComments);

// Get a specific comment by ID
router.get('/:id', commentController.getCommentById);

// Update a comment by ID
router.patch('/:id', commentController.updateCommentById);

// Delete a comment by ID
router.delete('/:id', commentController.deleteCommentById);

module.exports = router;
