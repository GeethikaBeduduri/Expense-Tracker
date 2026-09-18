import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Calendar,
} from 'lucide-react';
import { getExpenses, deleteExpense } from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import ExpenseTable from '../components/ExpenseTable.jsx';
import ExpenseModal from '../components/ExpenseModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Toast from '../components/Toast.jsx';
import { TableRowSkeleton } from '../components/LoadingSkeleton.jsx';

const CATEGORIES = [
  'All',
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other',
];

const PAYMENT_METHODS = ['All', 'UPI', 'Card', 'Cash', 'Bank Transfer', 'Other'];

const SORT_OPTIONS = [
  { id: 'date_desc', label: 'Newest First' },
  { id: 'date_asc', label: 'Oldest First' },
  { id: 'amount_desc', label: 'Highest Amount' },
  { id: 'amount_asc', label: 'Lowest Amount' },
];

const ITEMS_PER_PAGE = 8;

function Expenses() {
  const location = useLocation();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search, Filter & Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState('All');
  const [dateRange, setDateRange] = useState('all'); // 'all' | 'this_month' | 'last_30_days'
  const [sortBy, setSortBy] = useState('date_desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals & Dialogs
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'add', data: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, title: '' });
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(
    location.state?.toastMessage
      ? { message: location.state.toastMessage, type: 'success' }
      : null
  );

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getExpenses();
      setExpenses(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to retrieve transactions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Comprehensive multi-criteria filtering
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      // Text search in title or description
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query));

      // Category filter
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      // Payment method filter
      const matchesPayment =
        selectedPayment === 'All' || item.paymentMethod === selectedPayment;

      // Date range filter
      let matchesDate = true;
      if (dateRange !== 'all') {
        const itemDate = new Date(item.date);
        const now = new Date();
        if (dateRange === 'this_month') {
          matchesDate =
            itemDate.getMonth() === now.getMonth() &&
            itemDate.getFullYear() === now.getFullYear();
        } else if (dateRange === 'last_30_days') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
          matchesDate = itemDate >= thirtyDaysAgo;
        }
      }

      return matchesSearch && matchesCategory && matchesPayment && matchesDate;
    });
  }, [expenses, searchQuery, selectedCategory, selectedPayment, dateRange]);

  // Sort filtered records
  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount_desc') return b.amount - a.amount;
      if (sortBy === 'amount_asc') return a.amount - b.amount;
      return 0;
    });
  }, [filteredExpenses, sortBy]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedPayment, dateRange, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedExpenses.length / ITEMS_PER_PAGE));
  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedExpenses.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedExpenses, currentPage]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedPayment !== 'All' ||
    dateRange !== 'all' ||
    sortBy !== 'date_desc';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPayment('All');
    setDateRange('all');
    setSortBy('date_desc');
  };

  // Trigger Delete Confirmation Modal
  const requestDelete = (id) => {
    const item = expenses.find((e) => e._id === id);
    setDeleteConfirm({
      isOpen: true,
      id,
      title: item?.title ? `"${item.title}"` : 'this transaction',
    });
  };

  // Execute Confirmed Delete
  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    setDeleting(true);
    try {
      await deleteExpense(deleteConfirm.id);
      setExpenses((prev) => prev.filter((e) => e._id !== deleteConfirm.id));
      setDeleteConfirm({ isOpen: false, id: null, title: '' });
      setToast({ message: 'Expense deleted successfully', type: 'success' });
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to delete transaction.',
        type: 'error',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleModalSuccess = (item, actionType) => {
    fetchExpenses();
    setToast({
      message: `Expense ${actionType === 'added' ? 'recorded' : 'updated'} successfully`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <PageHeader
        breadcrumb="Transactions"
        title="Expenses"
        subtitle="Track, search, audit, and manage all your personal expenditures."
        badge={!loading && !error ? `${expenses.length} Records` : undefined}
        primaryAction={
          <button
            onClick={() => setModalState({ isOpen: true, mode: 'add', data: null })}
            className="btn-primary shadow-xs font-semibold"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Expense</span>
          </button>
        }
      />

      {/* ── Functional Search & Filter Toolbar ── */}
      <div className="card p-4 space-y-3.5 border border-surface-200/80 dark:border-surface-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input (Debounced / Real-time) */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute inset-y-0 left-3 my-auto text-surface-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search expenses by title or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-9 text-sm"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-input text-sm cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input text-sm cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-surface-100 dark:border-surface-800">
          <div className="flex flex-wrap items-center gap-2">
            {/* Payment Filter */}
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 text-xs font-medium text-surface-700 dark:text-surface-300 cursor-pointer"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm === 'All' ? 'All Payment Methods' : pm}
                </option>
              ))}
            </select>

            {/* Date Range Filter */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 text-xs font-medium text-surface-700 dark:text-surface-300 cursor-pointer"
            >
              <option value="all">All Dates</option>
              <option value="this_month">This Calendar Month</option>
              <option value="last_30_days">Last 30 Days</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}
          </div>

          <div className="text-xs text-surface-400 dark:text-surface-500 font-medium">
            Showing {filteredExpenses.length} of {expenses.length} results
          </div>
        </div>
      </div>

      {/* ── Loading Skeletons ── */}
      {loading && (
        <div className="card p-0 overflow-hidden border border-surface-200 dark:border-surface-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 dark:bg-surface-850 border-b border-surface-200 dark:border-surface-800">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase">Expense</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase">Category</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase">Amount</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase">Payment</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase">Date</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-surface-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                <TableRowSkeleton cols={6} />
                <TableRowSkeleton cols={6} />
                <TableRowSkeleton cols={6} />
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Error State ── */}
      {!loading && error && (
        <ErrorState message={error} onRetry={fetchExpenses} />
      )}

      {/* ── Empty State: Zero Total Records ── */}
      {!loading && !error && expenses.length === 0 && (
        <EmptyState
          title="No transactions recorded"
          description="Start tracking your expenditures to populate your financial ledger and view analytics."
          action={
            <button
              onClick={() => setModalState({ isOpen: true, mode: 'add', data: null })}
              className="btn-primary shadow-xs font-semibold text-xs py-2 px-4"
            >
              <Plus className="w-4 h-4" />
              Add First Expense
            </button>
          }
        />
      )}

      {/* ── Empty State: Filters Matched Zero ── */}
      {!loading && !error && expenses.length > 0 && filteredExpenses.length === 0 && (
        <EmptyState
          compact
          title="No matching transactions"
          description="No expenses matched your search criteria or selected filters."
          action={
            <button onClick={handleResetFilters} className="btn-secondary text-xs py-1.5 px-3">
              Clear All Filters
            </button>
          }
        />
      )}

      {/* ── Populated Table with Pagination ── */}
      {!loading && !error && paginatedExpenses.length > 0 && (
        <div className="space-y-4">
          <ExpenseTable
            expenses={paginatedExpenses}
            onView={(item) => setModalState({ isOpen: true, mode: 'view', data: item })}
            onEdit={(item) => setModalState({ isOpen: true, mode: 'edit', data: item })}
            onDelete={requestDelete}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 text-xs text-surface-500 dark:text-surface-400">
              <span>
                Page {currentPage} of {totalPages} ({filteredExpenses.length} total)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg font-semibold transition-colors ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-400'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Add / Edit / Inspect Modal ── */}
      <ExpenseModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        initialData={modalState.data}
        onClose={() => setModalState({ isOpen: false, mode: 'add', data: null })}
        onSuccess={handleModalSuccess}
      />

      {/* ── Delete Confirmation Dialog ── */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Transaction"
        message={`Are you sure you want to permanently delete ${deleteConfirm.title}? This will immediately update your dashboard and database.`}
        confirmText="Delete Transaction"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, title: '' })}
        loading={deleting}
      />

      {/* ── Toast Notification ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Expenses;
