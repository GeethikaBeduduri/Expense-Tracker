import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import expenseRoutes from './routes/expenseRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// ── Boot sequence: env → DB → Express ─────────────────────────────────────
// connectDB() will exit the process if Mongo is completely unreachable, so
// the server only starts when the database connection is confirmed.
await connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// ── CORS Configuration (Local development + Vercel production) ───────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((u) => u.trim()) : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      // Allow localhost or explicitly listed CLIENT_URL
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow any vercel.app deployment for this project
      if (origin.endsWith('.vercel.app')) return callback(null, true);

      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    success: true,
    message: 'Expense Tracker API is running',
    database: isConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// ── API routes ─────────────────────────────────────────────────────────────
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);

// ── Error handling (must be last) ──────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, HOST, () => {
  console.log(`🚀 Expense Tracker Server listening on ${HOST}:${PORT}`);
});
