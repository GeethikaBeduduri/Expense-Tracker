import express from 'express';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';

const router = express.Router();

// All business logic lives in the controller — routes only map HTTP verbs to functions.
router.route('/').get(getExpenses).post(createExpense);
router.route('/:id').get(getExpenseById).put(updateExpense).delete(deleteExpense);

export default router;
