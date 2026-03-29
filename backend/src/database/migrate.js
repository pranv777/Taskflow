// src/database/migrate.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const schema = `
CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'taskflow_db'}\`;
USE \`${process.env.DB_NAME || 'taskflow_db'}\`;

CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('user', 'admin') DEFAULT 'user',
  is_active   TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role  (role)
);

CREATE TABLE IF NOT EXISTS tasks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  status      ENUM('todo', 'in_progress', 'done') DEFAULT 'todo',
  priority    ENUM('low', 'medium', 'high') DEFAULT 'medium',
  user_id     INT NOT NULL,
  due_date    DATE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status  (status)
);

-- Seed admin user (password: Admin@123)
INSERT IGNORE INTO users (name, email, password, role)
VALUES (
  'Admin User',
  'admin@taskflow.com',
  '$2a$10$6fxk6Voyim5v10MTFOcpouCKco5feRKukrgBmFa3/Z3zAF5DXDrWy',
  'admin'
);
`;

async function migrate() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST || 'localhost',
    port:     process.env.DB_PORT || 3306,
    user:     process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  console.log('Running migrations…');
  await conn.query(schema);
  console.log('✅ Database & tables created successfully.');
  console.log('✅ Admin seeded → admin@taskflow.com / Admin@123');
  await conn.end();
}

migrate().catch(err => { console.error(err); process.exit(1); });
