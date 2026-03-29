// src/app.js
require('dotenv').config();
const express     = require('express');
const helmet      = require('helmet');
const cors        = require('cors');
const morgan      = require('morgan');
const rateLimit   = require('express-rate-limit');
const logger      = require('./utils/logger');
const errorHandler = require('./middlewares/error.middleware');

// Routes
const authRoutes  = require('./routes/auth.routes');
const taskRoutes  = require('./routes/task.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

/* ── Security ── */
app.use(helmet());
app.use(cors({
  origin:  process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/* ── Rate limiting ── */
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max:      100,
  message:  { success: false, message: 'Too many requests, please try again later.' },
}));

/* ── Body parsing ── */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

/* ── Logging ── */
app.use(morgan('combined', {
  stream: { write: (msg) => logger.http(msg.trim()) },
}));

/* ── Health check ── */
app.get('/health', (req, res) =>
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
);

/* ── API v1 routes ── */
app.use('/api/v1/auth',  authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/admin', adminRoutes);

/* ── 404 ── */
app.use((req, res) =>
  res.status(404).json({ success: false, message: 'Route not found' })
);

/* ── Global error handler ── */
app.use(errorHandler);

module.exports = app;
