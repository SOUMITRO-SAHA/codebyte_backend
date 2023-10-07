const express = require('express');
const router = express.Router();

const likeController = require('../controllers/like.controllers');

// Like a post
router.post('/likes', likeController.likePost);

// Unlike a post
router.delete('/likes', likeController.unlikePost);

module.exports = router;
