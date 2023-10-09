const express = require('express');
const router = express.Router();
const {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  updateCommunityById,
  deleteCommunityById,
} = require('../controllers/community.controllers');
const { isLoggedIn } = require('../middleware/auth.middleware');

// Create Community
router.post('/', isLoggedIn, createCommunity);

// Get All Communities
router.get('/', getAllCommunities);

// // Get Community by ID
// router.get('/:id', getCommunityById);

// // Update Community by ID
// router.put('/:id', isLoggedIn, updateCommunityById);

// // Delete Community by ID
// router.delete('/:id', isLoggedIn, deleteCommunityById);

module.exports = router;
