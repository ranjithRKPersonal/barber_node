const mongoose = require('mongoose');

const EntryType = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createByRole: {
    type: String,
    required: false,
  },
  createrId: {
    type: String,
    required: false,
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updateByRole: {
    type: String,
    required: false,
  },
  updateDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  location: {
    type: Object,
    required: false,
  },
  device: {
    type: Object,
    required: false,
  },
  entryStatus: {
    type: Boolean,
    required: false,
  },
});

const entrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    story: {
      type: Number,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    countryCode: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    reason: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: true,
    },
    temperature: {
      type: String,
      required: false,
    },
    purpose: {
      type: Object,
      required: true,
    },
    inEntry: {
      type: EntryType,
      required: false,
    },
    outEntry: {
      type: EntryType,
      required: false,
    },
    createdDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updatedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    deviceInfo: {
      type: Object,
      required: false,
    },
    entryPassId: {
      type: String,
      required: false,
    },
    entryUpdates: {
      type: Array,
      required: false,
    },
    vehicleNumber: {
      type: Object || String,
      required: false,
    },
  },
  { timestamps: true }
);

entrySchema.index({
  entryId: 1,
});

module.exports = mongoose.model('Entry', entrySchema);
