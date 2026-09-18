import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Expenses from '../pages/Expenses.jsx';
import AddExpense from '../pages/AddExpense.jsx';
import NotFound from '../pages/NotFound.jsx';

/**
 * Central routing configuration.
 * All authenticated pages are wrapped inside MainLayout (sidebar + header).
 */
function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/add-expense" element={<AddExpense />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
