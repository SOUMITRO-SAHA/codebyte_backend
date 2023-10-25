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
  followUser,
  UnFollowUser,
  getAllUsers,
  updateSocials,
  removeSocial,
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
  .get('/u/all', isLoggedIn, getAllUsers)
  .post('/u/update', isLoggedIn, updateProfile)
  .post('/u/socials', isLoggedIn, addSocials)
  .patch('/u/socials', isLoggedIn, updateSocials)
  .delete('/u/socials/:socialId', isLoggedIn, removeSocial)
  .post('/u/updatePassword', isLoggedIn, updatePassword)
  .post('/u/follow/:userId', isLoggedIn, followUser)
  .post('/u/unfollow/:userId', isLoggedIn, UnFollowUser);

module.exports = router;
