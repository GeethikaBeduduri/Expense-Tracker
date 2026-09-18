import axios from 'axios';

// ── Axios instance ─────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Expense API functions ──────────────────────────────────────────────────
export const getExpenses = () => api.get('/expenses');

export const getExpenseById = (id) => api.get(`/expenses/${id}`);

export const createExpense = (data) => api.post('/expenses', data);

export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);

export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

// ── Budget API functions ───────────────────────────────────────────────────
export const getBudgets = (month) =>
  api.get('/budgets', { params: month ? { month } : {} });

export const createBudget = (data) => api.post('/budgets', data);

export const updateBudget = (id, data) => api.put(`/budgets/${id}`, data);

export const deleteBudget = (id) => api.delete(`/budgets/${id}`);

export default api;
