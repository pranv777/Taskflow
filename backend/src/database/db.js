// src/database/db.js
const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

const pool = mysql.createPool({
  host:            process.env.DB_HOST     || 'localhost',
  port:            process.env.DB_PORT     || 3306,
  user:            process.env.DB_USER     || 'root',
  password:        process.env.DB_PASSWORD || '',
  database:        process.env.DB_NAME     || 'taskflow_db',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  enableKeepAlive:    true,
});

pool.getConnection()
  .then(conn => {
    logger.info('✅ MySQL pool connected');
    conn.release();
  })
  .catch(err => {
    logger.error('❌ MySQL connection failed: ' + err.message);
  });

module.exports = pool;
