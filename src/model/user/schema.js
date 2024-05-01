const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
  details: {
    type: Object,
    required: false,
  }
});

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    createdRole: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false,
      enum: ['Admin', 'Staff'],
    },
    story: {
      type: Number,
      required: false,
      default: 0,
    },
    activeSessions: {
      type: [sessionSchema],
      required: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
