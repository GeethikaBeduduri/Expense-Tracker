import { useState, useEffect } from 'react';
import { X, Calendar, CreditCard, Tag, DollarSign, FileText } from 'lucide-react';
import { createExpense, updateExpense } from '../services/api.js';
import { usePreferences } from '../context/PreferencesContext.jsx';

const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other',
];

const PAYMENT_METHODS = ['UPI', 'Card', 'Cash', 'Bank Transfer', 'Other'];

const getTodayDate = () => new Date().toISOString().split('T')[0];

const INITIAL_FORM = {
  title: '',
  amount: '',
  category: 'Food',
  date: getTodayDate(),
  paymentMethod: 'UPI',
  description: '',
};

/**
 * ExpenseModal — comprehensive modal for Creating, Editing, or Inspecting expenses.
 */
export default function ExpenseModal({
  isOpen,
  mode = 'add', // 'add' | 'edit' | 'view'
  initialData = null,
  onClose,
  onSuccess,
}) {
  const { currencySymbol, formatDate } = usePreferences();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (initialData && (mode === 'edit' || mode === 'view')) {
      setForm({
        title: initialData.title || '',
        amount: initialData.amount !== undefined ? String(initialData.amount) : '',
        category: initialData.category || 'Food',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : getTodayDate(),
        paymentMethod: initialData.paymentMethod || 'UPI',
        description: initialData.description || '',
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
    setServerError(null);
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount greater than 0';
    if (!form.category) errs.category = 'Category is required';
    if (!form.paymentMethod) errs.paymentMethod = 'Payment method is required';
    if (!form.date) errs.date = 'Date is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isView) return;

    setServerError(null);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
        paymentMethod: form.paymentMethod,
        description: form.description.trim(),
      };

      let result;
      if (isEdit && initialData?._id) {
        result = await updateExpense(initialData._id, payload);
      } else {
        result = await createExpense(payload);
      }

      onSuccess(result.data?.data, isEdit ? 'updated' : 'added');
      onClose();
    } catch (err) {
      setServerError(
        err.response?.data?.message || err.message || 'Failed to save transaction.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="card w-full max-w-lg p-6 bg-white dark:bg-surface-900 shadow-2xl border border-surface-200 dark:border-surface-800 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-100 dark:border-surface-800">
          <div>
            <h3 className="text-lg font-bold text-surface-900 dark:text-white">
              {isView ? 'Transaction Details' : isEdit ? 'Edit Expense' : 'Record New Expense'}
            </h3>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
              {isView
                ? 'Comprehensive record metadata and audit trail'
                : isEdit
                ? 'Update amount, category, or notes'
                : 'Log a new personal expense transaction'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 p-1.5 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Error Notification */}
        {serverError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-medium">
            {serverError}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Title */}
          <div>
            <label className="form-label">Title</label>
            <input
              name="title"
              type="text"
              placeholder="e.g. Grocery shopping, Metro card"
              value={form.title}
              onChange={handleChange}
              disabled={isView || submitting}
              className={`form-input ${errors.title ? 'form-input-error' : ''}`}
            />
            {errors.title && <p className="field-error">{errors.title}</p>}
          </div>

          {/* Amount & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Amount</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-500 font-semibold text-sm">
                  {currencySymbol}
                </span>
                <input
                  name="amount"
                  type="number"
                  step="any"
                  min="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={handleChange}
                  disabled={isView || submitting}
                  className={`form-input pl-8 ${errors.amount ? 'form-input-error' : ''}`}
                />
              </div>
              {errors.amount && <p className="field-error">{errors.amount}</p>}
            </div>

            <div>
              <label className="form-label">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={isView || submitting}
                className={`form-input ${errors.category ? 'form-input-error' : ''}`}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="field-error">{errors.category}</p>}
            </div>
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Date</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                disabled={isView || submitting}
                className={`form-input ${errors.date ? 'form-input-error' : ''}`}
              />
              {errors.date && <p className="field-error">{errors.date}</p>}
            </div>

            <div>
              <label className="form-label">Payment Method</label>
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                disabled={isView || submitting}
                className={`form-input ${errors.paymentMethod ? 'form-input-error' : ''}`}
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
              {errors.paymentMethod && <p className="field-error">{errors.paymentMethod}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Notes & Description (Optional)</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Add optional notes, receipt details, or context..."
              value={form.description}
              onChange={handleChange}
              disabled={isView || submitting}
              maxLength={500}
              className="form-input resize-none"
            />
          </div>

          {/* Metadata if viewing */}
          {isView && initialData && (
            <div className="p-3 bg-surface-50 dark:bg-surface-800/60 rounded-xl border border-surface-200 dark:border-surface-700 text-xs text-surface-500 space-y-1">
              <div className="flex justify-between">
                <span>Record ID:</span>
                <span className="font-mono text-surface-700 dark:text-surface-300">{initialData._id}</span>
              </div>
              <div className="flex justify-between">
                <span>Recorded On:</span>
                <span className="text-surface-700 dark:text-surface-300">{formatDate(initialData.createdAt)}</span>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-surface-100 dark:border-surface-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn-secondary text-xs py-2 px-4"
            >
              {isView ? 'Close' : 'Cancel'}
            </button>
            {!isView && (
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-xs py-2 px-5 font-semibold shadow-xs"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </span>
                ) : isEdit ? (
                  'Update Transaction'
                ) : (
                  'Save Expense'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
