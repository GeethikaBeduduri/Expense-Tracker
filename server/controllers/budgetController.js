import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';

const getCurrentMonthString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// ── GET /api/budgets ────────────────────────────────────────────────────────
// Returns all budgets for the specified month (or current month), dynamically computed with actual spend.
export const getBudgets = async (req, res, next) => {
  try {
    const month = req.query.month || getCurrentMonthString();
    const budgets = await Budget.find({ month }).sort({ createdAt: -1 });

    // Compute date boundaries for the selected month
    const [yearNum, monthNum] = month.split('-').map(Number);
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    // Fetch all expenses in this month range
    const monthlyExpenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate },
    });

    const budgetsWithProgress = budgets.map((b) => {
      const bObj = b.toObject();

      let spent = 0;
      if (b.category === 'Monthly Total') {
        spent = monthlyExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      } else {
        spent = monthlyExpenses
          .filter((e) => e.category === b.category)
          .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      }

      const remaining = b.monthlyLimit - spent;
      const percentage = b.monthlyLimit > 0 ? Math.round((spent / b.monthlyLimit) * 100) : 0;
      const isExceeded = spent > b.monthlyLimit;

      return {
        ...bObj,
        spent,
        remaining,
        percentage,
        isExceeded,
      };
    });

    res.status(200).json({
      success: true,
      month,
      count: budgetsWithProgress.length,
      data: budgetsWithProgress,
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/budgets ───────────────────────────────────────────────────────
// Creates a new budget or updates limit if already exists for month + category
export const createBudget = async (req, res, next) => {
  try {
    const { category, monthlyLimit, month = getCurrentMonthString() } = req.body;

    if (!category || !monthlyLimit) {
      const err = new Error('Category and monthlyLimit are required');
      err.statusCode = 400;
      return next(err);
    }

    const budget = await Budget.findOneAndUpdate(
      { category, month },
      { category, monthlyLimit: Number(monthlyLimit), month },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({ success: true, data: budget });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/budgets/:id ────────────────────────────────────────────────────
export const updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      { monthlyLimit: Number(req.body.monthlyLimit) },
      { new: true, runValidators: true }
    );

    if (!budget) {
      const err = new Error('Budget not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/budgets/:id ─────────────────────────────────────────────────
export const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);

    if (!budget) {
      const err = new Error('Budget not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      data: { id: req.params.id },
      message: 'Budget deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
