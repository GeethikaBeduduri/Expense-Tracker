import axios from 'axios';

// ── Axios instance ─────────────────────────────────────────────────────────
// Base URL is read from the Vite environment variable — never hard-coded.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Expense API functions ──────────────────────────────────────────────────
// All components import from this file; no raw axios calls outside services/.

export const getExpenses = () => api.get('/expenses');

export const getExpenseById = (id) => api.get(`/expenses/${id}`);

export const createExpense = (data) => api.post('/expenses', data);

export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);

export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

export default api;
