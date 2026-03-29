// src/routes/admin.routes.js
const router = require('express').Router();
const ctrl   = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.use(authenticate, authorize('admin'));

router.get('/stats',               ctrl.getDashboardStats);
router.get('/users',               ctrl.getAllUsers);
router.patch('/users/:id/toggle',  ctrl.toggleUserStatus);

module.exports = router;
