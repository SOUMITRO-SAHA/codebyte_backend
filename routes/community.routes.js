const express = require('express');
const router = express.Router();
const {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  updateCommunityById,
  deleteCommunityById,
  commentOnPost,
  deleteCommentOfPost,
} = require('../controllers/community.controllers');
const { isLoggedIn } = require('../middleware/auth.middleware');

// Create Community
router.post('/', isLoggedIn, createCommunity);

// Get All Communities
router.get('/', getAllCommunities);

// Get Community by ID
router.get('/:id', getCommunityById);

// Update Community by ID
router.patch('/:id', isLoggedIn, updateCommunityById);

// Delete Community by ID
router.delete('/:id', isLoggedIn, deleteCommunityById);

// Comment on community Post
router.post('/comment', isLoggedIn, commentOnPost);
router.delete('/comment/:id', isLoggedIn, deleteCommentOfPost);

module.exports = router;
