const multer = require('multer');
const Portfolio = require('../models/portfolio.schema');
const uploadPortfolioImage = require('../services/portfolioImageUploader');
const fs = require('fs');
const path = require('path');

exports.createPortfolio = async (req, res) => {
  uploadPortfolioImage.single('image')(req, res, async (err) => {
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
      return res.send({
        success: false,
        message: 'No photo is selected',
      });
    }

    try {
      let { title, description, liveProjectLink, techStack } = req.body;
      const imageUrl = req.file.path;

      const newPortfolio = new Portfolio({
        title,
        description,
        image: imageUrl,
        liveProjectLink,
        techStack,
      });

      const savedPortfolio = await newPortfolio.save();

      res.status(201).json({
        success: true,
        portfolios: savedPortfolio,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  });
};

exports.getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find().populate('techStack');
    res.status(200).json({ success: true, portfolios });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getPortfolioById = async (req, res) => {
  const { id } = req.params;
  try {
    const portfolio = await Portfolio.findById(id).populate('techStack');
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found',
      });
    }
    res.status(200).json({ success: true, portfolio });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.updatePortfolioById = async (req, res) => {
  const { id } = req.params;
  uploadPortfolioImage.single('image')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.send({
        success: false,
        message: 'Error uploading portfolio image',
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

    try {
      // Fetching the current Data
      const currentPortfolio = await Portfolio.findById(id);

      if (!currentPortfolio) {
        return res.send({
          success: false,
          message: 'Portfolio not found in database',
        });
      }

      // Getting the Previous image path
      const previousImagePath = currentPortfolio.image;

      if (req.file) {
        // Handle image upload
        const imagePath = req.file.path;

        // Push into the updated Object
        updateObject['thumbnail'] = imagePath;

        // Delete the previous image
        fs.unlink(previousImagePath);
      }

      const updatedPortfolio = await Portfolio.findByIdAndUpdate(
        id,
        updateObject,
        { new: true }
      );

      if (!updatedPortfolio) {
        return res.status(404).json({
          success: false,
          message: 'Portfolio not found',
        });
      }

      res.status(200).json({ success: true, portfolio: updatedPortfolio });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  });
};

exports.deletePortfolioById = async (req, res) => {
  const { id } = req.params;
  try {
    // Getting the current portfolio:
    const currentPortfolio = await Portfolio.findById(id);

    if (!currentPortfolio) {
      return res.send({
        success: false,
        message: 'Portfolio not found in the database',
      });
    }

    // Before deleting the portfolio from the database delete the image from the cloud storage:
    const prevImagePath = currentPortfolio.image;

    // Delete the image from the storage
    if (prevImagePath) {
      fs.unlinkSync(path.join(__dirname, '..', prevImagePath));
    }

    await Portfolio.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Portfolio deleted' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
