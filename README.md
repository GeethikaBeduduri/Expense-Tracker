# 💸 Expense Tracker

A full-stack web application to record and manage personal expenses, built as a college project demonstrating a clearly separated **frontend module**, **backend module**, **database layer**, and **REST API architecture**.

---

## Planned Features (All Phases)

- ✅ **Phase 1** — Core CRUD (add / list / delete expenses)
- 🔲 Phase 2 — User authentication (JWT), expense editing, search & filter
- 🔲 Phase 3 — Budget management, recurring expenses, analytics dashboard
- 🔲 Phase 4 — Export (PDF / Excel), notifications, mobile-responsive polish

---

## What Phase 1 Implements

| Area | What's Built |
|---|---|
| Backend | Express REST API, full CRUD, MongoDB/Mongoose, central error handling |
| Frontend | React + Vite + Tailwind, Sidebar layout, Dashboard, Expenses list, Add Expense form |
| Layer separation | `UI → services/api.js → Express routes → controllers → Mongoose models → MongoDB` |
| Validation | Server-side Mongoose schema validation + client-side inline field errors |
| UX | Loading states, error states, empty states, responsive sidebar, mobile drawer |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 3, React Router DOM 6, Axios |
| Backend | Node.js, Express 4, Mongoose 8 |
| Database | MongoDB (Atlas or local) |
| Dev tools | nodemon, dotenv, cors |

---

## Project Structure

```
expense-tracker/
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── assets/
│   │   ├── components/       # Navbar, Sidebar, Loading, ErrorMessage
│   │   ├── layouts/          # MainLayout (sidebar + outlet)
│   │   ├── pages/            # Dashboard, Expenses, AddExpense, NotFound
│   │   ├── routes/           # AppRoutes.jsx
│   │   ├── services/         # api.js — Axios instance + expense functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                   # Node + Express backend
│   ├── config/               # db.js — Mongoose connection
│   ├── controllers/          # expenseController.js — business logic
│   ├── middleware/           # errorMiddleware.js — 404 + central handler
│   ├── models/               # Expense.js — Mongoose schema
│   ├── routes/               # expenseRoutes.js — HTTP verb mapping
│   ├── .env.example
│   └── server.js             # Entry point
│
├── .gitignore
└── README.md
```

---

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A MongoDB database — [MongoDB Atlas (free)](https://www.mongodb.com/atlas) or a local instance

---

## Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

## Environment Setup

### Backend (`server/.env`)

Open `server/.env` and replace the placeholder with your real connection string:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

> **Where to paste it:** Replace the entire value of `MONGO_URI` in `server/.env`.  
> The file is listed in `.gitignore` — your credentials will never be committed.

### Frontend

The client uses a Vite proxy in development — no `.env` file is required for the default setup.  
If you change the backend port, create `client/.env` with:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Starting the Backend

```bash
cd server
npm run dev
```

Expected output:
```
✅ MongoDB connected: <cluster-host>
🚀 Server running on http://localhost:5000
```

---

## Starting the Frontend

```bash
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/expenses` | List all expenses |
| `GET` | `/api/expenses/:id` | Get one expense |
| `POST` | `/api/expenses` | Create expense |
| `PUT` | `/api/expenses/:id` | Update expense |
| `DELETE` | `/api/expenses/:id` | Delete expense |

All responses use a consistent envelope:

```json
{ "success": true, "data": { ... } }
{ "success": false, "message": "Error description" }
```

---

## Phase 1 Limitations

The following are **deliberately not built** in Phase 1:

- No user authentication or login
- No expense editing UI (Edit button is disabled, API endpoint exists)
- No search, filter, or pagination
- No charts or analytics
- No budget tracking
- No PDF/Excel export
- No recurring expenses
- No notifications

---

## Suggested Phase 2

**User Authentication & Expense Management**

- JWT-based login / registration
- User profiles and per-user expense isolation
- Expense editing UI wired to the existing `PUT /api/expenses/:id` endpoint
- Search, filter by category/date range, and pagination on the Expenses page
- Dashboard summary cards computed from real API data
