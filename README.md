# NOVAX

NOVAX is a scalable industrial management platform. This repository contains the Phase 1 foundation for the project, establishing a clean, separated architecture for future development.

## Phase 1 Scope

This phase establishes the technical foundation of the project:
- **Frontend**: React (Vite) + TypeScript setup with basic routing and placeholder layouts.
- **Backend**: Node.js + Express + TypeScript setup with basic architectural structure (routes, controllers, middlewares).
- **Database**: Relational database configuration via Prisma ORM, with basic architectural placeholders for Users, Roles, and Organizations.

The goal of Phase 1 is **not** to build features, but to provide a robust starting point for subsequent phases where features, advanced authentication, UI design, and multi-tenancy will be built.

## Project Structure

```text
/
├── frontend/        # React application (Vite)
├── backend/         # Node.js Express API
├── .env.example     # Example environment variables
└── README.md        # This file
```

## Required Environment Variables

You need to set up environment variables for both the backend and frontend.

**Backend (`backend/.env`):**
See `.env.example` in the root or `backend/.env.example` for details. You will need:
- `PORT`: The port the backend runs on (default: 5000).
- `DATABASE_URL`: Connection string for your PostgreSQL database.
- `JWT_SECRET`: Secret key for signing authentication tokens.

## Installation & Running

### 1. Backend

```bash
cd backend
npm install
```

Generate Prisma client:
```bash
npx prisma generate
```

Run development server:
```bash
npm run dev
```

The backend server should start on `http://localhost:5000`.

**Health Check API**
You can test the backend is running by visiting:
`GET http://localhost:5000/api/health`

### 2. Frontend

Open a new terminal window:

```bash
cd frontend
npm install
```

Run development server:
```bash
npm run dev
```

The frontend should start on `http://localhost:5173`.
