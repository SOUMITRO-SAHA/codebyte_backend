const express = require('express');
const {
  registration,
  login,
  logOut,
  checkSession,
  forgotPassword,
  updateProfile,
  addSocials,
  updatePassword,
  getUserInfo,
} = require('../controllers/user.controllers.js');
const { isLoggedIn } = require('../middleware/auth.middleware.js');

const router = express.Router();

// Routers
// Authentication:
router
  .post('/auth/registration', registration)
  .post('/auth/login', login)
  .post('/auth/forgotPassword', forgotPassword)
  .get('/auth/logout', logOut)
  .get('/auth/session', isLoggedIn, checkSession);

// User:
router
  .get('/u', isLoggedIn, getUserInfo)
  .post('/u/update', isLoggedIn, updateProfile)
  .post('/u/socials', isLoggedIn, addSocials)
  .post('/u/updatePassword', isLoggedIn, updatePassword);

module.exports = router;
