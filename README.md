# DevConnect — Developer Job & Career Platform

A full-stack job portal where developers create profiles, browse and apply to jobs, track their applications, and admins manage postings and applicants.

---

## Tech Stack

| Layer | Tech |
|---|---|
| **Frontend** | React 18 + Vite + TypeScript + Tailwind CSS v3 |
| **Backend** | Node.js + Express + TypeScript |
| **Database** | PostgreSQL 16 + TypeORM |
| **Auth** | JWT (access + refresh tokens) + bcrypt |
| **Validation** | Zod (all API inputs) |
| **Rate Limiting** | express-rate-limit (10 req/15min on auth) |

---

## Project Structure

```
DevConnect/
├── client/               # React Vite frontend
│   └── src/
│       ├── api/          # Axios API functions
│       ├── components/   # Reusable UI components
│       ├── context/      # AuthContext
│       ├── pages/        # Route-level pages
│       │   └── admin/    # Admin-only pages
│       ├── types/        # TypeScript types
│       └── utils/        # Formatting helpers
├── server/               # Express API
│   └── src/
│       ├── config/       # DB + env config
│       ├── controllers/  # Request handlers
│       ├── entities/     # TypeORM entities
│       ├── middleware/   # Auth, admin, error, rate limit
│       ├── routes/       # Express routers
│       ├── seeds/        # Database seeder
│       ├── services/     # Business logic
│       ├── utils/        # JWT, password, response helpers
│       └── validators/   # Zod schemas
├── docker-compose.yml    # PostgreSQL via Docker
└── README.md
```

---

## Architecture Overview

### Backend Layering
```
HTTP Request
    → Route (express Router)
    → Middleware (auth, admin, rate limiter)
    → Controller (parse request, call service)
    → Service (business logic)
    → TypeORM Repository (DB access)
    → Response (sendSuccess / sendError)
```

### Auth Flow
- **Register/Login**: returns `accessToken` (15min JWT) + sets `refreshToken` in HttpOnly cookie (7d)
- **Client**: stores `accessToken` in memory (`window.__accessToken`), never localStorage
- **Refresh**: Axios interceptor auto-calls `/auth/refresh` on 401 responses, retries the original request
- **Logout**: clears HttpOnly cookie server-side

---

## ER Diagram

```
User (1) ──── (M) Application (M) ──── (1) Job
  │                                       │
  └── (M2M) user_skills ──── (M) Skill ──(M2M) job_skills
  │
  └── (1) ──── (M) SavedJob (M) ──── (1) Job
```

### Entities
- **User**: id, name, email, passwordHash, role (user|admin), bio, location, resumeUrl, experienceLevel, createdAt, updatedAt
- **Skill**: id, name (unique), createdAt
- **Job**: id, title, description, company, location, salaryMin, salaryMax, jobType, postedById, createdAt, updatedAt
- **Application**: id, userId, jobId, status, coverLetter, createdAt, updatedAt — UNIQUE(userId, jobId)
- **SavedJob**: id, userId, jobId, createdAt — UNIQUE(userId, jobId)
- **user_skills** (join): userId, skillId
- **job_skills** (join): jobId, skillId

---

## API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/v1/auth/register | Public | Register |
| POST | /api/v1/auth/login | Public | Login |
| POST | /api/v1/auth/refresh | Public | Refresh access token |
| POST | /api/v1/auth/logout | Auth | Logout |
| GET | /api/v1/users/me | Auth | Get own profile |
| PUT | /api/v1/users/me | Auth | Update profile |
| POST | /api/v1/users/me/skills | Auth | Add skill |
| DELETE | /api/v1/users/me/skills/:skillId | Auth | Remove skill |
| GET | /api/v1/users/skills | Public | List all skills |
| GET | /api/v1/jobs | Public | List/search/filter jobs (paginated) |
| GET | /api/v1/jobs/:id | Public | Job detail |
| POST | /api/v1/jobs | Admin | Create job |
| PUT | /api/v1/jobs/:id | Admin | Update job |
| DELETE | /api/v1/jobs/:id | Admin | Delete job |
| POST | /api/v1/jobs/:id/apply | Auth | Apply to job |
| POST | /api/v1/jobs/:id/save | Auth | Save job |
| DELETE | /api/v1/jobs/:id/save | Auth | Unsave job |
| GET | /api/v1/jobs/:jobId/applications | Admin | Applicants for job |
| GET | /api/v1/applications/me | Auth | My applications |
| GET | /api/v1/applications/saved | Auth | My saved jobs |
| PUT | /api/v1/applications/:id/status | Admin | Update status |
| GET | /api/v1/admin/stats | Admin | Dashboard stats |

### Query Parameters for GET /api/v1/jobs
| Param | Type | Description |
|---|---|---|
| page | number | Page number (default: 1) |
| limit | number | Items per page (max 50, default 10) |
| search | string | Search title/company/location |
| location | string | Filter by location |
| jobType | string | full-time, part-time, remote, contract |
| skillId | uuid | Filter by required skill |
| salaryMin | number | Min salary filter |
| salaryMax | number | Max salary filter |

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- Docker + Docker Compose (for PostgreSQL)
- npm v9+

### 1. Start the database

```bash
docker compose up -d
```

This starts PostgreSQL on port 5432 with default credentials.

### 2. Setup the server

```bash
cd server
npm install
```

Copy the example env (already configured for Docker defaults):
```bash
# .env is already present with defaults matching docker-compose.yml
# Edit if needed:
notepad .env
```

Run the seed script (creates DB schema + sample data):
```bash
npm run seed
```

Start the dev server:
```bash
npm run dev
```

Server runs on **http://localhost:5000**

### 3. Setup the client

```bash
cd client
npm install
npm run dev
```

Client runs on **http://localhost:5173**

---

## Demo Credentials

After running `npm run seed` in the server:

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@devconnect.io | Admin@123456 |
| **Developer** | alex@example.com | User@123456 |

---

## Features

### For Developers
- ✅ Register / Login / Logout with JWT auth
- ✅ Create and edit profile (bio, location, experience, resume URL)
- ✅ Add/remove skills from profile
- ✅ Browse all jobs with search + multi-filter
- ✅ View job details
- ✅ Apply to jobs with optional cover letter (one application per job)
- ✅ Save/unsave jobs for later
- ✅ Track application history with status updates

### For Admins
- ✅ Create, edit, delete job postings
- ✅ Assign skills to jobs
- ✅ View all applicants per job with their profile details
- ✅ Update application status (applied → under review → shortlisted → hired/rejected)
- ✅ Dashboard with total jobs, total applications, top jobs by applicant count

---

## Security

- Passwords hashed with bcrypt (12 salt rounds)
- JWT access tokens expire in 15 minutes
- Refresh tokens stored in HttpOnly, Secure, SameSite=Strict cookies
- RBAC middleware for admin routes
- Zod validation on all inputs
- Helmet.js for HTTP security headers
- CORS restricted to configured client origin
- Rate limiting: 10 req/15min on auth endpoints, 200 req/15min globally

---

## Environment Variables

### server/.env

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=devconnect
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_ACCESS_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
UPLOAD_DIR=uploads
```
