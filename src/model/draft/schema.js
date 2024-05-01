const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: false,
      trim: true,
    },
    countryCode: {
      type: String,
      required: false,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: false,
    },
    draftType:  {
        type: Number,
        required: true,
        enum: [1, 2],
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
      required: false,
      enum: ['New', 'Confirmed', 'Cancelled', 'Completed', 'Paid'],
    },
    serviceIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
      required: false,
    },
    bookingNotes: {
      type: String,
      required: false,
    },
    servicePriceList: {
      type: Array,
      required: false,
    },
    bookingDate: {
      type: Date,
      required: false,
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
    totalPrice: {
        type: Number,
        required: false,
    },
    isCustomPrice: {
        type: Boolean,
        required: false
    },
    paymentType: {
        type: Number,
        required: false,
        enum: [1, 2, 3, 4, 5],
      },
  },
  { timestamps: true }
);



module.exports = mongoose.model('Draft', draftSchema);
