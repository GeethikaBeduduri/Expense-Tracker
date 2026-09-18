import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createExpense } from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';

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
  category: '',
  description: '',
  date: getTodayDate(),
  paymentMethod: 'UPI',
};

function validate(values) {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = 'Title is required';
  } else if (values.title.trim().length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }

  if (!values.amount || values.amount === '') {
    errors.amount = 'Amount is required';
  } else {
    const num = Number(values.amount);
    if (isNaN(num) || num <= 0) {
      errors.amount = 'Amount must be greater than ₹0';
    }
  }

  if (!values.category) {
    errors.category = 'Please select a category';
  }

  if (!values.paymentMethod) {
    errors.paymentMethod = 'Please select a payment method';
  }

  if (!values.date) {
    errors.date = 'Transaction date is required';
  }

  if (values.description && values.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters';
  }

  return errors;
}

function AddExpense() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error on edit
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await createExpense({
        ...form,
        title: form.title.trim(),
        amount: Number(form.amount),
        description: form.description.trim(),
      });

      // Redirect to /expenses with success toast state
      navigate('/expenses', {
        state: { toastMessage: `Expense "${form.title.trim()}" added successfully!` },
        replace: true,
      });
    } catch (err) {
      setServerError(
        err.response?.data?.message || err.message || 'Failed to save expense. Please check your network and retry.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ── Page Header (Identical structure across pages) ── */}
      <PageHeader
        breadcrumb="Transactions"
        title="Add Expense"
        subtitle="Record a new expenditure to maintain your financial ledger."
        secondaryAction={
          <Link to="/expenses" className="btn-secondary text-xs shadow-2xs">
            <svg className="w-3.5 h-3.5 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Expenses
          </Link>
        }
      />

      {/* ── Main Form Card ── */}
      <div className="card shadow-sm border border-surface-200">
        {/* Server Error Notification */}
        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold">Unable to Save Record</p>
              <p className="text-xs text-red-700 mt-0.5">{serverError}</p>
            </div>
          </div>
        )}

        <form id="add-expense-form" onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Field: Title */}
          <div>
            <label htmlFor="title" className="form-label flex items-center justify-between">
              <span>
                Expense Title <span className="text-red-500">*</span>
              </span>
              <span className="text-[11px] text-surface-400 font-normal">e.g., Grocery shopping, Uber ride</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter expense title..."
              value={form.title}
              onChange={handleChange}
              disabled={submitting}
              className={`form-input ${errors.title ? 'form-input-error' : ''}`}
            />
            {errors.title && <p className="field-error">{errors.title}</p>}
          </div>

          {/* Grid: Amount + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Amount with INR Prefix */}
            <div>
              <label htmlFor="amount" className="form-label">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-500 font-semibold text-sm">
                  ₹
                </div>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="any"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={handleChange}
                  disabled={submitting}
                  className={`form-input pl-8 ${errors.amount ? 'form-input-error' : ''}`}
                />
              </div>
              {errors.amount && <p className="field-error">{errors.amount}</p>}
            </div>

            {/* Category Select */}
            <div>
              <label htmlFor="category" className="form-label">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={submitting}
                className={`form-input ${errors.category ? 'form-input-error' : ''}`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && <p className="field-error">{errors.category}</p>}
            </div>
          </div>

          {/* Grid: Date + Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Date */}
            <div>
              <label htmlFor="date" className="form-label">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                disabled={submitting}
                className={`form-input ${errors.date ? 'form-input-error' : ''}`}
              />
              {errors.date && <p className="field-error">{errors.date}</p>}
            </div>

            {/* Payment Method */}
            <div>
              <label htmlFor="paymentMethod" className="form-label">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                disabled={submitting}
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

          {/* Field: Description / Notes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="description" className="form-label mb-0">
                Description / Notes <span className="text-surface-400 font-normal text-xs">(Optional)</span>
              </label>
              <span className="text-[11px] text-surface-400">
                {form.description.length}/500
              </span>
            </div>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Add optional notes, receipt details, or context..."
              value={form.description}
              onChange={handleChange}
              disabled={submitting}
              maxLength={500}
              className={`form-input resize-none ${errors.description ? 'form-input-error' : ''}`}
            />
            {errors.description && <p className="field-error">{errors.description}</p>}
          </div>

          {/* Actions: Save & Cancel */}
          <div className="pt-4 border-t border-surface-100 flex items-center justify-end gap-3">
            <Link
              to="/expenses"
              className="btn-secondary text-sm"
              tabIndex={submitting ? -1 : 0}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              id="submit-expense-btn"
              className="btn-primary shadow-xs min-w-[130px] justify-center"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Expense</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;
