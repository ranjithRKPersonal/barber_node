const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
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
    acceptTermsAndCondtions: {
      type: Boolean,
      required: false,
      default: true,
    },
    address: {
      type: String,
      required: false,
    },
    accountVerified: {
      type: Boolean,
      required: false,
    },
    appointmentStatus: {
      type: String,
      required: true,
      enum: ['New', 'Confirmed', 'Cancelled', 'Completed', 'Paid'],
    },
    serviceIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
      required: true,
    },
    bookingNotes: {
      type: String,
      required: false,
    },
    servicePriceList: {
      type: Array,
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    appointmentType: {
      type: Number,
      require: false
    },
    tax: {
      type: Array,
      required: false
    },
    spotDiscount: {
      type: Object,
      required: false
    },
  },
  { timestamps: true }
);

appointmentSchema.index({
  visitorId: 1,
});

module.exports = mongoose.model('Appointment', appointmentSchema);
