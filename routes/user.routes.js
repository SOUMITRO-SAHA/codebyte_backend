const express = require('express');
const {
  registration,
  login,
  logOut,
  checkSession,
  forgotPassword,
  updateProfile,
  addSocials,
  getUserInfo,
  followUser,
  UnFollowUser,
  getAllUsers,
  updateSocials,
  removeSocial,
  getUserById,
  resetPassword,
} = require('../controllers/user.controllers.js');
const { isLoggedIn } = require('../middleware/auth.middleware.js');

const router = express.Router();

// Routers
// Authentication:
router
  .post('/auth/registration', registration)
  .post('/auth/login', login)
  .post('/auth/forgotPassword', forgotPassword)
  .patch('/auth/reset-password', isLoggedIn, resetPassword)
  .get('/auth/logout', logOut)
  .get('/auth/session', isLoggedIn, checkSession);

// User:
router
  .get('/u', isLoggedIn, getUserInfo)
  .get('/u/all', isLoggedIn, getAllUsers)
  .get('/u/:id', isLoggedIn, getUserById)
  .patch('/u/update', isLoggedIn, updateProfile);

// Socials
router
  .post('/u/socials', isLoggedIn, addSocials)
  .patch('/u/socials', isLoggedIn, updateSocials)
  .delete('/u/socials/:socialId', isLoggedIn, removeSocial);

// Follow and Un - Follow
router
  .post('/u/follow/:userId', isLoggedIn, followUser)
  .post('/u/unfollow/:userId', isLoggedIn, UnFollowUser);

module.exports = router;
