import Expense from '../models/Expense.js';

// ── GET /api/expenses ──────────────────────────────────────────────────────
// Returns all expenses, newest first.
export const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/expenses/:id ──────────────────────────────────────────────────
export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      const err = new Error('Expense not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/expenses ─────────────────────────────────────────────────────
export const createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/expenses/:id ──────────────────────────────────────────────────
export const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,          // Return the updated document
        runValidators: true, // Run schema validators on update
      }
    );

    if (!expense) {
      const err = new Error('Expense not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/expenses/:id ───────────────────────────────────────────────
export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      const err = new Error('Expense not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      data: { id: req.params.id },
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
