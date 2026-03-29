// src/middlewares/error.middleware.js
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} → ${err.message}`);

  const statusCode = err.statusCode || 500;
  const message    = err.isOperational ? err.message : 'Internal Server Error';

  res.status(statusCode).json({ success: false, message });
};
