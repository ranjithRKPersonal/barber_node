const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: String,
      required: false,
      trim: true,
    },
    paymentType: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    expenseDate : {
      type: Date,
      required: true
    },
    story: {
      type: Number,
      required: false,
      default: 0,
    },
    createdRole: {
      type: String,
      required: true,
      default: 'Admin'
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
