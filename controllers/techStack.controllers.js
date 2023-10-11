const TechStack = require('../models/techStack.schema');
const multer = require('multer');
const uploadIcons = require('../services/iconImageUploader');
const fs = require('fs');
const path = require('path');

exports.createTechStack = async (req, res) => {
  uploadIcons.single('icon')(req, res, async function (err) {
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No photo is selected',
      });
    }

    try {
      const { name } = req.body;

      if (typeof name !== 'string') {
        return res.send({
          success: false,
          message: 'Name should be a string',
        });
      }

      const iconPath = req.file.path;

      const techStack = new TechStack({ name, icon: iconPath });

      const savedTechStack = await techStack.save();

      res.status(201).json({ success: true, techStack: savedTechStack });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  });
};

exports.getAllTechStacks = async (req, res) => {
  try {
    const techStacks = await TechStack.find();

    res.status(200).json({ success: true, techStacks });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.deleteTechStackById = async (req, res) => {
  const { id } = req.params;
  try {
    const techStack = await TechStack.findById(id);

    if (!techStack) {
      return res.status(404).json({
        success: false,
        message: 'Tech Stack not found',
      });
    }

    // Get the icon path
    const iconPath = techStack.icon;

    // Delete the icon file if it exists
    if (iconPath) {
      fs.unlinkSync(path.join(__dirname, '..', iconPath));
    }

    // Delete the tech stack entry from the database
    await TechStack.findByIdAndDelete(id);

    if (!techStack) {
      return res.status(404).json({
        success: false,
        message: 'Tech Stack not found',
      });
    }

    res.status(200).json({ success: true, message: 'Tech Stack deleted' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
