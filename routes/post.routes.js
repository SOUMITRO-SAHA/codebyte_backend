const express = require('express');
const router = express.Router();

const postController = require('../controllers/blog.controllers');

// Create a new post
router.post('/', postController.createPost);

// Get all posts
router.get('/', postController.getAllPosts);

// Get a specific post by ID
router.get('/:id', postController.getPostById);

// Update a post by ID
router.put('/:id', postController.updatePostById);

// Delete a post by ID
router.delete('/:id', postController.deletePostById);

module.exports = router;
