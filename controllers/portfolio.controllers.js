const multer = require('multer');
const Portfolio = require('../models/portfolio.schema');
const uploadPortfolioImage = require('../services/portfolioImageUploader');

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
      const { title, description, liveProjectLink, techStack } = req.body;
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
