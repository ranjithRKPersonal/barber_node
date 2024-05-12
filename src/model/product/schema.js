const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
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

module.exports = mongoose.model('Product', productSchema);
