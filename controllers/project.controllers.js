const Project = require('../models/project.schema');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const {
  createProjectValidator,
  updateProjectValidator,
} = require('../validator/project.validator');

// Create a new project
exports.createProject = (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message,
      });
    }

    const projectObject = {
      projectTitle: fields.projectTitle[0],
      shortDescription: fields.shortDescription[0],
      projectDescription: fields.projectDescription[0],
      projectLink: fields.projectLink[0],
      videoLink: fields.videoLink[0],
      sourceCodeLink: fields.sourceCodeLink[0],
      category: fields.category[0],
      customSlug: fields.customSlug[0],
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

    if (!files.thumbnail) {
      return res.status(400).json({
        success: false,
        message: 'No photo is selected',
      });
    }

    try {
      // Handle image upload
      const uploadFolderPath = path.join(__dirname, '../uploads/thumbnails');
      const photo = files.thumbnail;
      const filePath = photo[0].filepath;
      const data = fs.readFileSync(filePath);
      const imageExtension = photo[0].mimetype.split('/')[1];
      const imageName = `p-th_${Date.now()}.${imageExtension}`;
      const imagePath = path.join(uploadFolderPath, imageName);
      fs.writeFileSync(imagePath, data);

      const newProject = new Project({
        ...value,
        author: req.user._id,
        thumbnail: imagePath,
      });

      if (!newProject) {
        return res.json({
          success: false,
          message: 'Error creating new project',
        });
      }

      const savedProject = await newProject.save();

      res.status(201).json({ success: true, project: savedProject });
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
  const projectId = req.params.id;

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message,
      });
    }

    const updateObject = {};

    // Loop through the fields and add them to the updateObject if they have a value
    Object.keys(fields).forEach((key) => {
      if (fields[key]) {
        updateObject[key] = fields[key][0];
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
    if (files.thumbnail) {
      // Handle image upload
      const uploadFolderPath = path.join(__dirname, '../uploads/thumbnails');
      const photo = files.thumbnail;
      const filePath = photo[0].filepath;
      const data = fs.readFileSync(filePath);
      const imageExtension = photo[0].mimetype.split('/')[1];
      const imageName = `p-th_${Date.now()}.${imageExtension}`;
      const imagePath = path.join(uploadFolderPath, imageName);
      fs.writeFileSync(imagePath, data);

      // Push into the updateObject
      updateObject[thumbnail] = imagePath;
    }

    try {
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
