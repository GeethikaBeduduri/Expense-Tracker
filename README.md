# 💸 ExpenseTracker — Smart Personal Finance SaaS

> A modern, data-driven personal finance and expense management platform built on the MERN stack with interactive visualization, dynamic multi-currency preferences, automated budget burn tracking, and exportable financial audit statements.

---

## 🌟 Executive Overview

**ExpenseTracker** is an end-to-end full-stack personal finance web application designed with the aesthetic standards and reliability of modern fintech SaaS products. It replaces rudimentary CRUD spreadsheets with an intelligent financial ledger connected to MongoDB Atlas.

### Key Capabilities
- **Real-Time Financial Dashboard**: Executive summary displaying Total Spending, Current Month Velocity, Transaction Volume, and Average Ticket Size computed dynamically from your database records.
- **Interactive Visualizations (Recharts)**: Real data area charts showing monthly burn rate curves and donut charts detailing category allocation.
- **Full Transaction Ledger**: Searchable, filterable, and sortable transaction records with inline inspection, modal-based editing, and safe two-step deletion dialogs.
- **Dynamic Budget Allocation**: Category-specific and monthly budget ceilings with real-time progress indicators comparing actual spend against limits.
- **Deep Financial Analytics**: Peak expense identification, top expense category rankings, and day-of-week spending distribution trends.
- **Audit Reports & 1-Click CSV Export**: Date-filtered transaction audit summaries with direct client-side CSV downloads compatible with Excel, Google Sheets, and Apple Numbers.
- **Global Financial Preferences**: Instant switching between currencies (₹ INR, $ USD, € EUR, £ GBP), date formatting standards, and high-contrast dark/light fintech theme.

---

## 🏗️ Architecture & Data Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         CLIENT (React 18 + Vite)                         │
│  Tailwind CSS · Recharts · Lucide Icons · PreferencesContext · Axios     │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │ HTTP REST API Requests (JSON)
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         SERVER (Node.js + Express)                       │
│     CORS Filter · JSON Body Parser · Route Handlers · Controllers        │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │ Mongoose ODM / Schema Validation
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         DATABASE (MongoDB Atlas)                         │
│           Collections: `expenses` · `budgets` (Real Data Only)           │
└──────────────────────────────────────────────────────────────────────────┘
```

### Source of Truth
- **MongoDB Atlas** is the exclusive source of truth.
- **Zero Dummy Data**: When the database has zero records, intentional empty states guide the user. No hardcoded sample arrays, demo transactions, or fallback figures are ever displayed.

---

## 💻 Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend Framework** | React 18 + Vite 5 | Fast, modular component architecture with SPA routing |
| **Styling & UI** | Tailwind CSS 3 (Dark Mode) | Deep slate fintech theme with clean contrast |
| **Data Visualization** | Recharts 2 | Responsive Area Charts, Donut Charts, and Bar Charts |
| **Iconography** | Lucide React | Clean, modern feather icon set |
| **Routing** | React Router DOM 6 | Client-side routing with persistent navigation shell |
| **API Client** | Axios | Configured with centralized `baseURL` and interceptors |
| **Backend Framework** | Node.js + Express 4 | RESTful routing with centralized error handling |
| **Object Modeling** | Mongoose 8 | Strict validation schemas and automated timestamps |
| **Database** | MongoDB Atlas / Local | Cloud document storage |

---

## 📁 Project Structure

```
Expense-Tracker/
├── client/
│   ├── src/
│   │   ├── components/         # Reusable UI (Sidebar, Navbar, StatCard, ChartCard,
│   │   │                       #  ExpenseTable, ExpenseModal, ConfirmDialog, Toast, Badge)
│   │   ├── context/            # PreferencesContext (Currency, Date format, Dark Theme)
│   │   ├── layouts/            # MainLayout (collapsible responsive sidebar shell)
│   │   ├── pages/              # Dashboard, Expenses, AddExpense, Budgets,
│   │   │                       #  Analytics, Reports, Settings, NotFound
│   │   ├── routes/             # AppRoutes (Central route declaration)
│   │   ├── services/           # api.js (Axios instance + CRUD API bindings)
│   │   ├── App.jsx             # Root provider container
│   │   ├── main.jsx            # React DOM entry point
│   │   └── index.css           # Design tokens, typography, and dark mode base
│   ├── .env.example            # Sample client configuration
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json             # Direct client-root Vercel configuration
│   └── vite.config.js          # Vite config with API proxy
│
├── server/
│   ├── config/                 # db.js (MongoDB connection with retry logic)
│   ├── controllers/            # expenseController.js, budgetController.js
│   ├── middleware/             # errorMiddleware.js (404 and central error handler)
│   ├── models/                 # Expense.js, Budget.js
│   ├── routes/                 # expenseRoutes.js, budgetRoutes.js
│   ├── .env.example            # Sample server configuration
│   ├── package.json
│   └── server.js               # Entry point with production CORS & 0.0.0.0 binding
│
├── render.yaml                 # Render Blueprint for automated backend deployment
├── vercel.json                 # Root monorepo Vercel configuration
├── .gitignore
└── README.md
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js**: `v18+`
- **npm**: `v9+`
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/expense_tracker`) or free [MongoDB Atlas Cluster](https://www.mongodb.com/atlas)

### 2. Clone the Repository
```bash
git clone https://github.com/GeethikaBeduduri/Expense-Tracker.git
cd Expense-Tracker
```

### 3. Backend Setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/expense_tracker?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
# Server listening on http://0.0.0.0:5000
```

### 4. Frontend Setup
In a new terminal window:
```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
# Local: http://localhost:5173
```

---

## 🌐 Production Deployment

### Backend: Render.com
1. Connect the GitHub repository `GeethikaBeduduri/Expense-Tracker` to Render.
2. Select **Web Service** or use the included [`render.yaml`](./render.yaml) Blueprint:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
3. Add Environment Variables in Render Dashboard:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `CLIENT_URL`: `https://your-frontend.vercel.app`

### Frontend: Vercel
1. Import `GeethikaBeduduri/Expense-Tracker` into Vercel.
2. Under Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client` (or leave as root; the included [`vercel.json`](./vercel.json) handles both)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variables in Vercel:
   - `VITE_API_URL`: `https://your-render-backend.onrender.com/api`
4. Click **Deploy**.

> ⚠️ **Deployment Note**: If a previous deployment URL was showing an unrelated project (such as "Block Planning Portal"), verify in Vercel/Render that the active project is connected to `GeethikaBeduduri/Expense-Tracker` rather than an older or separate repository.

---

## 📡 REST API Reference

All API responses follow a uniform JSON structure:

```json
{
  "success": true,
  "data": { ... }
}
```

### Health Check
- `GET /api/health` — Verifies server uptime and MongoDB connection state.

### Expenses API
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/expenses` | Retrieve all expenses (newest first) |
| `GET` | `/api/expenses/:id` | Retrieve single expense by ID |
| `POST` | `/api/expenses` | Create a new expense record |
| `PUT` | `/api/expenses/:id` | Update an existing expense |
| `DELETE` | `/api/expenses/:id` | Permanently delete an expense |

### Budgets API
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/budgets` | Retrieve budget targets with dynamic spend calculation |
| `POST` | `/api/budgets` | Set or update a monthly budget limit |
| `PUT` | `/api/budgets/:id` | Modify an existing budget target |
| `DELETE` | `/api/budgets/:id` | Remove a budget target |

---

## 🔒 Security & Data Integrity

- **Environment Secrets**: Database credentials and API endpoints are loaded strictly via environment variables (`dotenv`) and excluded from version control via `.gitignore`.
- **CORS Protection**: Express backend validates requests from allowed local and production origins.
- **Input Sanitization**: Schema validation at both frontend and Mongoose layers ensures monetary amounts are strictly positive and categories conform to supported types.
