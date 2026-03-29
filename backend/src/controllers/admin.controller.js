// src/controllers/admin.controller.js
const db = require('../database/db');
const { success, error } = require('../utils/response');

exports.getAllUsers = async (req, res, next) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    return success(res, users);
  } catch (err) { next(err); }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return error(res, 'User not found', 404);

    const user = rows[0];
    if (user.role === 'admin') return error(res, 'Cannot modify admin accounts', 403);

    const newStatus = user.is_active ? 0 : 1;
    await db.query('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, req.params.id]);

    return success(res, { is_active: Boolean(newStatus) }, `User ${newStatus ? 'activated' : 'deactivated'} successfully`);
  } catch (err) { next(err); }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [[{ totalUsers }]]  = await db.query('SELECT COUNT(*) as totalUsers FROM users WHERE role = "user"');
    const [[{ totalTasks }]]  = await db.query('SELECT COUNT(*) as totalTasks FROM tasks');
    const [[{ doneTasks }]]   = await db.query('SELECT COUNT(*) as doneTasks FROM tasks WHERE status = "done"');
    const [[{ activeTasks }]] = await db.query('SELECT COUNT(*) as activeTasks FROM tasks WHERE status = "in_progress"');

    return success(res, { totalUsers, totalTasks, doneTasks, activeTasks });
  } catch (err) { next(err); }
};
