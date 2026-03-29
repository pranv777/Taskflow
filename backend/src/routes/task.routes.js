// src/routes/task.routes.js
const router   = require('express').Router();
const ctrl     = require('../controllers/task.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { createTaskValidator, updateTaskValidator } = require('../validators/task.validator');

// All task routes require authentication
router.use(authenticate);

/**
 * @route   GET  /api/v1/tasks
 * @desc    Get tasks (own tasks for user, all tasks for admin)
 * @access  Private
 * @query   status, priority, page, limit, search
 */
router.get('/',    ctrl.getTasks);

/**
 * @route   GET  /api/v1/tasks/:id
 * @desc    Get a single task by ID
 * @access  Private
 */
router.get('/:id', ctrl.getTaskById);

/**
 * @route   POST /api/v1/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/', createTaskValidator, validate, ctrl.createTask);

/**
 * @route   PUT  /api/v1/tasks/:id
 * @desc    Update a task
 * @access  Private (owner or admin)
 */
router.put('/:id', updateTaskValidator, validate, ctrl.updateTask);

/**
 * @route   DELETE /api/v1/tasks/:id
 * @desc    Delete a task
 * @access  Private (owner or admin)
 */
router.delete('/:id', ctrl.deleteTask);

module.exports = router;
