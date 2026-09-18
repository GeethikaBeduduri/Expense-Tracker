import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle, AlertCircle } from 'lucide-react';
import { createExpense } from '../services/api.js';
import { usePreferences } from '../context/PreferencesContext.jsx';
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
  category: 'Food',
  description: '',
  date: getTodayDate(),
  paymentMethod: 'UPI',
};

function validate(values, currencySymbol) {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = 'Expense title is required';
  } else if (values.title.trim().length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }

  if (!values.amount || values.amount === '') {
    errors.amount = 'Amount is required';
  } else {
    const num = Number(values.amount);
    if (isNaN(num) || num <= 0) {
      errors.amount = `Amount must be greater than ${currencySymbol}0`;
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
  const { currencySymbol } = usePreferences();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear field error on typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validate(form, currencySymbol);
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
        state: { toastMessage: `Expense "${form.title.trim()}" saved to ledger!` },
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
      {/* ── Page Header ── */}
      <PageHeader
        breadcrumb="Transactions"
        title="New Expense"
        subtitle="Record where your money went and sync directly with MongoDB Atlas."
        secondaryAction={
          <Link to="/expenses" className="btn-secondary text-xs">
            <ArrowLeft className="w-3.5 h-3.5 text-surface-400" />
            Back to Expenses
          </Link>
        }
      />

      {/* ── Form Card ── */}
      <div className="bg-[#0e111a] border border-white/[0.09] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Server Error Notification */}
        {serverError && (
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Failed to Save Transaction</p>
              <p className="text-xs text-rose-400 mt-0.5">{serverError}</p>
            </div>
          </div>
        )}

        <form id="add-expense-form" onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* SECTION 1: TRANSACTION DETAILS */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 border-b border-white/[0.08] pb-1.5 mb-4 block">
              Transaction Details
            </span>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="form-label flex items-center justify-between">
                  <span>
                    Expense Title <span className="text-rose-400">*</span>
                  </span>
                  <span className="text-[11px] text-surface-500 font-normal">e.g., Grocery shopping, AWS hosting</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Amount */}
                <div>
                  <label htmlFor="amount" className="form-label">
                    Amount <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400 font-bold text-sm">
                      {currencySymbol}
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
                      className={`form-input pl-8 font-mono ${errors.amount ? 'form-input-error' : ''}`}
                    />
                  </div>
                  {errors.amount && <p className="field-error">{errors.amount}</p>}
                </div>

                {/* Category Select */}
                <div>
                  <label htmlFor="category" className="form-label">
                    Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    disabled={submitting}
                    className={`form-input cursor-pointer ${errors.category ? 'form-input-error' : ''}`}
                  >
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label htmlFor="date" className="form-label">
                    Date <span className="text-rose-400">*</span>
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
                    Payment Method <span className="text-rose-400">*</span>
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                    disabled={submitting}
                    className={`form-input cursor-pointer ${errors.paymentMethod ? 'form-input-error' : ''}`}
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
            </div>
          </div>

          {/* SECTION 2: NOTES & METADATA */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 border-b border-white/[0.08] pb-1.5 mb-4 block">
              Notes & Metadata
            </span>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="description" className="form-label mb-0">
                  Description / Context <span className="text-surface-500 font-normal text-xs">(Optional)</span>
                </label>
                <span className="text-[11px] text-surface-500 font-mono">
                  {form.description.length}/500
                </span>
              </div>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Add optional notes, invoice details, vendor information..."
                value={form.description}
                onChange={handleChange}
                disabled={submitting}
                maxLength={500}
                className={`form-input resize-none ${errors.description ? 'form-input-error' : ''}`}
              />
              {errors.description && <p className="field-error">{errors.description}</p>}
            </div>
          </div>

          {/* Actions: Save & Cancel */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <Link
              to="/expenses"
              className="btn-secondary text-xs"
              tabIndex={submitting ? -1 : 0}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              id="submit-expense-btn"
              className="btn-primary min-w-[140px]"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Saving...</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  <span>Save Expense</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;
