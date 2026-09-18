import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Food',
          'Transport',
          'Shopping',
          'Bills',
          'Entertainment',
          'Health',
          'Education',
          'Other',
        ],
        message: '{VALUE} is not a valid category',
      },
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },

    date: {
      type: Date,
      default: Date.now,
    },

    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other'],
        message: '{VALUE} is not a valid payment method',
      },
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
