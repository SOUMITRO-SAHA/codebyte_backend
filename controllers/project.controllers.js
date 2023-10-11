const Project = require('../models/project.schema');
const multer = require('multer');
const {
  createProjectValidator,
  updateProjectValidator,
} = require('../validator/project.validator');
const upload = require('../services/imageUploader');
const fs = require('fs');

// Create a new project
exports.createProject = async (req, res) => {
  upload.single('thumbnail')(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.send({
        success: false,
        message: 'Error uploading file',
        error: err.message,
      });
    } else if (err) {
      return res.send({
        success: false,
        message: 'Internal Server Error',
        error: err.message,
      });
    }

    const projectObject = {
      projectTitle: req.body.projectTitle,
      shortDescription: req.body.shortDescription,
      projectDescription: req.body.projectDescription,
      projectLink: req.body.projectLink,
      videoLink: req.body.videoLink,
      sourceCodeLink: req.body.sourceCodeLink,
      category: req.body.category,
      customSlug: req.body.customSlug,
    };

    // Validate the requests:
    const { error, value } = createProjectValidator.validate(projectObject);

    if (error) {
      return res.send({
        success: false,
        message: 'Validation Error',
        error: error.details[0].message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No photo is selected',
      });
    }

    try {
      const thumbnailPath = req.file.path;
      const newProject = new Project({
        ...value,
        author: req.user._id,
        thumbnail: thumbnailPath,
      });

      if (!newProject) {
        return res.json({
          success: false,
          message: 'Error creating new project',
        });
      }

      const savedProject = await newProject.save();

      res.status(200).json({ success: true, project: savedProject });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  });
};

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Get a specific project by ID
exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Update a project by ID
exports.updateProjectById = async (req, res) => {
  const { id: projectId } = req.params;
  upload.single('thumbnail')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.send({
        success: false,
        message: 'Error uploading file',
        error: err.message,
      });
    } else if (err) {
      return res.send({
        success: false,
        message: 'Internal Server Error',
        error: err.message,
      });
    }

    const updateObject = {};

    // If the object has value then it will add to updatedObject
    Object.keys(req.body).forEach((key) => {
      if (req.body[key]) {
        updateObject[key] = req.body[key];
      }
    });

    const { error, value } = updateProjectValidator.validate(updateObject);

    if (error) {
      return res.send({
        success: false,
        message: 'Validation Error',
        error: error.details[0].message,
      });
    }
    try {
      // Fetch the current data
      const currentProject = await Project.findById(projectId);

      if (!currentProject) {
        return res.send({
          success: false,
          message: 'Project not found in the Database',
        });
      }

      // Getting the Previous thumbnail path
      const previousThumbnailPath = currentProject.thumbnail;

      if (req.file) {
        // Handle image upload
        const imagePath = req.file.path;

        // Push into the updateObject
        updateObject['thumbnail'] = imagePath;

        // Delete the previous image
        fs.unlinkSync(previousThumbnailPath);
      }

      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        updateObject,
        { new: true }
      );

      if (!updatedProject) {
        return res
          .status(404)
          .json({ success: false, message: 'Project not found' });
      }

      res.status(200).json({ success: true, project: updatedProject });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  });
};

// Delete a project by ID
exports.deleteProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res
        .status(404)
        .json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
      project: deletedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
