const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
} = require('../controllers/project.controllers');

// Create a new project
router.post('/', createProject);

// Get all projects
router.get('/', getAllProjects);

// Get a specific project by ID
router.get('/:id', getProjectById);

// Update a project by ID
router.patch('/:id', updateProjectById);

// Delete a project by ID
router.delete('/:id', deleteProjectById);

module.exports = router;
