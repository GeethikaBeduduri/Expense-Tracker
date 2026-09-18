import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import expenseRoutes from './routes/expenseRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// ── Boot sequence: env → DB → Express ─────────────────────────────────────
// connectDB() will exit the process if Mongo is completely unreachable, so
// the server only starts when the database connection is confirmed.
await connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
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
  });
});

// ── API routes ─────────────────────────────────────────────────────────────
app.use('/api/expenses', expenseRoutes);

// ── Error handling (must be last) ──────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
