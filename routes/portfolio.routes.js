const express = require('express');
const router = express.Router();
const {
  createPortfolio,
  getAllPortfolios,
  updatePortfolioById,
  deletePortfolioById,
  getPortfolioById,
} = require('../controllers/portfolio.controllers');
const { isLoggedIn } = require('../middleware/auth.middleware');

router.post('/', isLoggedIn, createPortfolio);
router.get('/', getAllPortfolios);

router.patch('/:id', isLoggedIn, updatePortfolioById);
router.get('/:id', getPortfolioById);
router.delete('/:id', deletePortfolioById);

module.exports = router;
