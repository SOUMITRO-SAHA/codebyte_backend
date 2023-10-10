const express = require('express');
const router = express.Router();

const postController = require('../controllers/blog.controllers');
const { isLoggedIn } = require('../middleware/auth.middleware');

// Create a new post
router.post('/', isLoggedIn, postController.createPost);

// Get all posts
router.get('/', postController.getAllPosts);

// Get Posts by User Info:
router.get('/q', postController.getPostByUserId);

// Get a specific post by ID
router.get('/:id', postController.getPostById);

// Update a post by ID
router.patch('/:id', postController.updatePostById);

// Delete a post by ID
router.delete('/:id', postController.deletePostById);

module.exports = router;
