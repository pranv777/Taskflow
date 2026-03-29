// src/middlewares/auth.middleware.js
const jwt  = require('jsonwebtoken');
const { error } = require('../utils/response');

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return error(res, 'Access denied. No token provided.', 401);

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return error(res, 'Token has expired.', 401);
    return error(res, 'Invalid token.', 401);
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return error(res, 'Access denied. Insufficient permissions.', 403);
  next();
};
