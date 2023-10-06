const JWT = require('jsonwebtoken');
const User = require('../models/user.schema');
const { config } = require('../config');

exports.isLoggedIn = async (req, res, next) => {
  let token;

  if (
    req.cookies.token ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer'))
  ) {
    token = req.cookies.token || req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Invalid token',
    });
  }

  try {
    const decodedJwtPayload = JWT.verify(token, config.JWT_SECRET);
    //_id, find user based on id, set this in req.user
    req.user = await User.findById(decodedJwtPayload._id);
    next();
  } catch (error) {
    throw new CustomError('NOt authorized to access this route', 401);
  }
};
