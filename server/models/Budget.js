import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Budget category is required'],
      enum: {
        values: [
          'Monthly Total',
          'Food',
          'Transport',
          'Shopping',
          'Bills',
          'Entertainment',
          'Health',
          'Education',
          'Other',
        ],
        message: '{VALUE} is not a valid budget category',
      },
    },

    monthlyLimit: {
      type: Number,
      required: [true, 'Monthly budget limit is required'],
      min: [1, 'Budget limit must be greater than 0'],
    },

    month: {
      type: String, // format: "YYYY-MM"
      default: () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
      },
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate budget per category in the same month
budgetSchema.index({ category: 1, month: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
