# Task Manager (MERN)

A full-stack Task Management Web Application using the MERN stack:

- MongoDB (tasks per user)
- Express.js (REST APIs + JWT auth)
- React.js (responsive UI + hooks)
- Node.js

## Features

- User Registration & Login (JWT)
- Protected dashboard
- Task CRUD: Create, Update, Delete, View
- Mark tasks Pending/Completed
- Search, filter (status), pagination

## Tech Stack

- Frontend: React + Vite, TailwindCSS, Axios, React Router
- Backend: Node.js + Express, Mongoose, JWT, bcryptjs

## Project Structure

- `backend/` - Express API
- `frontend/` - React app

## Setup

### 1) Backend

1. Go to backend:
   - `backend/`
2. Create a `.env` file (copy from `.env.example`):
   - `backend/.env`
3. Install dependencies:
   - `npm install`
4. Run server:
   - `npm run dev` (or `node index.js`)

Required env vars:

- `MONGO_URI`
- `JWT_SECRET`
- `PORT`

### 2) Frontend

1. Go to frontend:
   - `frontend/`
2. Install dependencies:
   - `npm install`
3. Run app:
   - `npm run dev`
4. Open the displayed localhost URL

## API

Base URL: `http://localhost:5000/api`

Authentication:

- Send JWT in header: `Authorization: Bearer <token>`

Tasks:

- `GET /api/tasks?q=&status=&page=&limit=`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Demo / Screenshots

- Run both frontend and backend.
- Register/login, then test:
  - Create task
  - Edit task
  - Toggle status
  - Delete task
  - Search/filter
  - Pagination

## Notes

- Ensure MongoDB is running and `MONGO_URI` is correct.
