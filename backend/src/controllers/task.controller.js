// src/controllers/task.controller.js
const db = require('../database/db');
const { success, error } = require('../utils/response');

/* ─── helpers ────────────────────────────────── */
const ALLOWED_STATUSES   = ['todo', 'in_progress', 'done'];
const ALLOWED_PRIORITIES = ['low', 'medium', 'high'];

/* ─── GET /tasks ─────────────────────────────── */
exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10, search } = req.query;
    const isAdmin = req.user.role === 'admin';

    let sql    = 'SELECT t.*, u.name as user_name FROM tasks t JOIN users u ON t.user_id = u.id WHERE 1=1';
    const params = [];

    // Non-admins only see their own tasks
    if (!isAdmin) { sql += ' AND t.user_id = ?'; params.push(req.user.id); }

    if (status   && ALLOWED_STATUSES.includes(status))     { sql += ' AND t.status = ?';   params.push(status); }
    if (priority && ALLOWED_PRIORITIES.includes(priority)) { sql += ' AND t.priority = ?'; params.push(priority); }
    if (search)  { sql += ' AND t.title LIKE ?'; params.push(`%${search}%`); }

    // Count total
    const countSql = sql.replace('SELECT t.*, u.name as user_name', 'SELECT COUNT(*) as total');
    const [[{ total }]] = await db.query(countSql, params);

    // Paginate
    const offset = (Number(page) - 1) * Number(limit);
    sql += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const [tasks] = await db.query(sql, params);

    return success(res, {
      tasks,
      pagination: {
        total,
        page:       Number(page),
        limit:      Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) { next(err); }
};

/* ─── GET /tasks/:id ─────────────────────────── */
exports.getTaskById = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT t.*, u.name as user_name FROM tasks t JOIN users u ON t.user_id = u.id WHERE t.id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return error(res, 'Task not found', 404);

    const task = rows[0];
    if (req.user.role !== 'admin' && task.user_id !== req.user.id)
      return error(res, 'Access denied', 403);

    return success(res, task);
  } catch (err) { next(err); }
};

/* ─── POST /tasks ────────────────────────────── */
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status = 'todo', priority = 'medium', due_date } = req.body;

    const [result] = await db.query(
      'INSERT INTO tasks (title, description, status, priority, user_id, due_date) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description || null, status, priority, req.user.id, due_date || null]
    );

    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    return success(res, rows[0], 'Task created successfully', 201);
  } catch (err) { next(err); }
};

/* ─── PUT /tasks/:id ─────────────────────────── */
exports.updateTask = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return error(res, 'Task not found', 404);

    const task = rows[0];
    if (req.user.role !== 'admin' && task.user_id !== req.user.id)
      return error(res, 'Access denied', 403);

    const { title, description, status, priority, due_date } = req.body;
    const updated = {
      title:       title       ?? task.title,
      description: description ?? task.description,
      status:      status      ?? task.status,
      priority:    priority    ?? task.priority,
      due_date:    due_date    ?? task.due_date,
    };

    await db.query(
      'UPDATE tasks SET title=?, description=?, status=?, priority=?, due_date=? WHERE id=?',
      [updated.title, updated.description, updated.status, updated.priority, updated.due_date, req.params.id]
    );

    const [updated_rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    return success(res, updated_rows[0], 'Task updated successfully');
  } catch (err) { next(err); }
};

/* ─── DELETE /tasks/:id ──────────────────────── */
exports.deleteTask = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return error(res, 'Task not found', 404);

    const task = rows[0];
    if (req.user.role !== 'admin' && task.user_id !== req.user.id)
      return error(res, 'Access denied', 403);

    await db.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    return success(res, null, 'Task deleted successfully');
  } catch (err) { next(err); }
};
