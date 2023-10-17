const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
  getProjectsByUserId,
} = require('../controllers/project.controllers');
const { isLoggedIn } = require('../middleware/auth.middleware');

// Create a new project
router.post('/', isLoggedIn, createProject);

// Get all projects
router.get('/', getAllProjects);

// Get Projects by User Info:
router.get('/q', getProjectsByUserId);

// Get a specific project by ID
router.get('/:id', getProjectById);

// Update a project by ID
router.patch('/:id', updateProjectById);

// Delete a project by ID
router.delete('/:id', deleteProjectById);

module.exports = router;
