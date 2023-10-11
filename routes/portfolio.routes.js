const express = require('express');
const router = express.Router();

const { createPortfolio } = require('../controllers/portfolio.controllers');

router.post('/', createPortfolio);

module.exports = router;
