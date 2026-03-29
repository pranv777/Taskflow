#  TaskFlow — Scalable REST API with Auth & RBAC

A production-ready full-stack task management application built with **Node.js + Express + MySQL** (backend) and **React** (frontend), featuring JWT authentication, role-based access control, and a clean developer experience.

---

##  Project Structure

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   │   ├── auth.controller.js
│   │   │   ├── task.controller.js
│   │   │   └── admin.controller.js
│   │   ├── routes/            # API route definitions
│   │   ├── middlewares/       # Auth, validation, error handling
│   │   ├── validators/        # express-validator rules
│   │   ├── database/          # DB pool + migration script
│   │   ├── utils/             # Logger, response helpers
│   │   ├── app.js             # Express app config
│   │   └── server.js          # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios client + service functions
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # AuthContext (JWT state)
│   │   ├── pages/             # Login, Register, Dashboard, AdminPanel
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── TaskFlow_API.postman_collection.json
├── SCALABILITY.md
└── README.md
```

---

##  Quick Start (Local Development)

### Prerequisites
- Node.js ≥ 18
- MySQL 8.0
- npm

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

### 2. Setup the Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
node src/database/migrate.js   # Creates DB, tables, and seeds admin user
npm run dev                     # Starts on http://localhost:5000
```

### 3. Setup the Frontend

```bash
cd ../frontend
cp .env.example .env
npm install
npm start                       # Starts on http://localhost:3000
```

---

##  Docker Setup (Recommended)

```bash
# From the project root
docker-compose up --build
```

Services start at:
- Frontend → http://localhost:3000
- Backend API → http://localhost:5000
- MySQL → localhost:3306

---

##  API Endpoints

### Base URL: `http://localhost:5000/api/v1`

#### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login + receive JWT |
| GET | `/auth/me` | Private | Get current user info |

#### Tasks (CRUD)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/tasks` | Private | List tasks (paginated, filterable) |
| GET | `/tasks/:id` | Private | Get single task |
| POST | `/tasks` | Private | Create a task |
| PUT | `/tasks/:id` | Private (owner/admin) | Update task |
| DELETE | `/tasks/:id` | Private (owner/admin) | Delete task |

**Query params for GET /tasks:** `status`, `priority`, `search`, `page`, `limit`

#### Admin (requires `role: admin`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/stats` | Admin | Platform-wide statistics |
| GET | `/admin/users` | Admin | List all users |
| PATCH | `/admin/users/:id/toggle` | Admin | Activate/deactivate user |

---

##  Database Schema

```sql
users
  id, name, email, password (bcrypt), role (user|admin),
  is_active, created_at, updated_at

tasks
  id, title, description, status (todo|in_progress|done),
  priority (low|medium|high), user_id (FK→users), due_date,
  created_at, updated_at
```

---

##  Security Features

- **Passwords** hashed with `bcryptjs` (10 rounds)
- **JWT** signed with HS256, configurable expiry
- **Helmet.js** sets secure HTTP headers
- **CORS** restricted to configured client origin
- **Rate limiting** — 100 req / 15 min per IP
- **Input validation** via `express-validator` on all write endpoints
- **Role-based guards** — middleware chain: `authenticate → authorize('admin')`
- Non-root Docker user for container security

---

##  Postman Collection

Import `TaskFlow_API.postman_collection.json` into Postman.

The **Login** request automatically saves the JWT token to `{{token}}` for all subsequent requests.

---

##  Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@taskflow.com | Admin@123 |
| User | Register via UI or API | — |

---

##  Scalability

See [SCALABILITY.md](./SCALABILITY.md) for the full architecture roadmap including horizontal scaling, Redis caching, microservices migration path, and CI/CD.

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 |
| Framework | Express.js 4 |
| Database | MySQL 8 + mysql2 |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| Logging | Winston |
| Frontend | React 18 + React Router 6 |
| HTTP Client | Axios |
| Containerisation | Docker + Docker Compose |
| Web server | Nginx (frontend) |
