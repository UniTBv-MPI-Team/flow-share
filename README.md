# FlowShare

A collaborative group expense and task management platform built as a university project for the MPI (Managementul Proiectelor Informatice) course at Transilvania University of Brașov.

**Live demo:** https://flowshare.stefantech.space

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Setup — Local Development](#setup--local-development)
- [Setup — Docker](#setup--docker)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [CI/CD Pipeline](#cicd-pipeline)
- [Team](#team)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express 5 + TypeScript |
| Frontend | EJS (server-side rendering) + CSS + Vanilla JS |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT + bcrypt + cookie-parser |
| Testing | Jest + Supertest |
| CI/CD | GitHub Actions |
| Containerization | Docker + Docker Compose |
| Deployment | Oracle Free Tier (Ubuntu 24.04) |

---

## Features

- **Authentication** — Register, login and logout with JWT stored in httpOnly cookies
- **Groups** — Create groups, invite members, manage admin roles
- **Kanban Board** — Create and assign tasks per group with TO_DO / IN_PROGRESS / DONE stages
- **Expense Tracker** — Log shared expenses per group with multi-currency support (EUR, USD, RON)
- **Contributions** — Track how much each member has contributed to each expense, with cap enforcement
- **Recurring Expenses** — Mark expenses as recurring (daily, weekly, monthly)

---

## Architecture

```
Client (Browser)
      │
      ▼
 Nginx (reverse proxy + SSL)
      │
      ▼
 Express 5 App (port 3000)
  ├── /auth        → Auth routes (register, login, logout)
  ├── /            → Nav routes (SSR pages)
  ├── /api/user    → User API
  ├── /api/group   → Group API
  ├── /api/group-member → Group Member API
  ├── /api/task    → Task API
  ├── /api/expense → Expense API
  ├── /api/contribution → Contribution API
  └── /api/health  → Health check
      │
      ▼
 Prisma ORM
      │
      ▼
 PostgreSQL (Docker container)
```

---

## Database Schema

```
User
 └── GroupMember (many-to-many with Group)
      ├── Task (assigned tasks)
      └── Contribution (expense contributions)

Group
 ├── GroupMember
 ├── Task
 └── Expense
      └── Contribution
```

---

## Setup — Local Development

**Prerequisites:** Node.js 20+, PostgreSQL

```bash
# Clone the repository
git clone https://github.com/UniTBv-MPI-Team/flow-share.git
cd flow-share

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your local database credentials

# Run database migrations
npx prisma migrate deploy
npx prisma generate

# Start development server
npm run dev
```

App runs at `http://localhost:3000`

---

## Setup — Docker

**Prerequisites:** Docker, Docker Compose

```bash
git clone https://github.com/UniTBv-MPI-Team/flow-share.git
cd flow-share

cp .env.example .env
# Edit .env — set JWT_SECRET and SESSION_SECRET

docker-compose up --build -d
```

App runs at `http://localhost:3000`

To view logs:
```bash
docker-compose logs -f app
```

To stop:
```bash
docker-compose down
```

---

## Environment Variables

Copy `.env.example` and fill in the values:

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/flowshare` |
| `JWT_SECRET` | Secret for signing JWT tokens | random 32-char string |
| `SESSION_SECRET` | Secret for session middleware | random 32-char string |
| `NODE_ENV` | Environment | `development` / `production` |
| `PORT` | App port | `3000` |

Generate secure secrets with:
```bash
openssl rand -base64 32
```

---

## Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only (requires running PostgreSQL)
npm run test:integration

# Lint
npm run lint
```

---

## CI/CD Pipeline

Every Pull Request targeting `main` triggers the CI pipeline:

```
PR opened
   └── Lint        (ESLint)
   └── Unit Tests  (Jest — no DB required)
   └── Integration Tests (Jest + Supertest — PostgreSQL service)
```

Every merge to `main` triggers automatic deployment:

```
Merge to main
   └── SSH into Oracle server
   └── git pull origin main
   └── docker-compose up --build -d
```

---

## Team

| Member | Role |
|---|---|
| **Dino** | DevOps + Team Lead |
| **Sebi** | Backend Developer |
| **Stefan** | Frontend Developer |
| **Alex** | QA Engineer |

> Transilvania University of Brașov — MPI 2025-2026
