// src/validators/task.validator.js
const { body, query } = require('express-validator');

exports.createTaskValidator = [
  body('title')
    .trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title max 200 characters'),

  body('description')
    .optional().trim().isLength({ max: 2000 }).withMessage('Description max 2000 characters'),

  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),

  body('due_date')
    .optional()
    .isISO8601().withMessage('due_date must be a valid date (YYYY-MM-DD)'),
];

exports.updateTaskValidator = [
  body('title')
    .optional().trim().notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 200 }),

  body('description')
    .optional().trim().isLength({ max: 2000 }),

  body('status')
    .optional().isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),

  body('priority')
    .optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),

  body('due_date')
    .optional().isISO8601().withMessage('due_date must be a valid date'),
];
