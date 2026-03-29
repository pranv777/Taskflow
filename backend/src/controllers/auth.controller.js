// src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../database/db');
const { success, error } = require('../utils/response');

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return error(res, 'Email already registered', 409);

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    );

    const token = generateToken({ id: result.insertId, name, email, role: 'user' });

    return success(
      res,
      { token, user: { id: result.insertId, name, email, role: 'user' } },
      'User registered successfully',
      201
    );
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      'SELECT id, name, email, password, role, is_active FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0)
      return error(res, 'Invalid email or password', 401);

    const user = rows[0];
    if (!user.is_active)
      return error(res, 'Account is disabled. Contact admin.', 403);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return error(res, 'Invalid email or password', 401);

    const token = generateToken({
      id:    user.id,
      name:  user.name,
      email: user.email,
      role:  user.role,
    });

    const { password: _, ...safeUser } = user;
    return success(res, { token, user: safeUser }, 'Login successful');
  } catch (err) { next(err); }
};

exports.getMe = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return error(res, 'User not found', 404);
    return success(res, rows[0]);
  } catch (err) { next(err); }
};
