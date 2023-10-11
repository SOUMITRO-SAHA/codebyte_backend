const express = require('express');
const router = express.Router();
const {
  createTechStack,
  getAllTechStacks,
  deleteTechStackById,
} = require('../controllers/techStack.controllers');

// Create a new Tech Stack
router.post('/', createTechStack);

// Get all Tech Stacks
router.get('/', getAllTechStacks);

// Delete a Tech Stack by ID
router.delete('/:id', deleteTechStackById);

module.exports = router;
