const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    invoiceNumber: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    isCustomPrice: {
        type: Boolean,
        required: true,
        default: false
    },
    story: {
      type: Number,
      required: false,
      default: 0,
    },
    createdRole: {
      type: String,
      required: false,
    },
    paymentType: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5, 6, 7, 8],
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model('Invoice', invoiceSchema);
