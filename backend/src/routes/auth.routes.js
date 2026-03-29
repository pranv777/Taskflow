// src/routes/auth.routes.js
const router   = require('express').Router();
const ctrl     = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { registerValidator, loginValidator } = require('../validators/auth.validator');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidator, validate, ctrl.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and get JWT
 * @access  Public
 */
router.post('/login', loginValidator, validate, ctrl.login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get logged-in user info
 * @access  Private
 */
router.get('/me', authenticate, ctrl.getMe);

module.exports = router;
