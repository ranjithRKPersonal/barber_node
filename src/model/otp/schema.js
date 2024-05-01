

const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    otp: {
      type: Number,
      required: false,
      unique: false
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    otpExpireIn: {
      type: Number,
      required: false
    },
    expireIn: {
        type: Number,
        required: false
    },
    verified: {
      type: Boolean,
      required: true,
      default: false
    },
    phoneNumber: {
      type: Number,
      required: false
    }
  }
);

otpSchema.index({expireIn: 1}, {expireAfterSeconds: 60});

module.exports = mongoose.model("Otp", otpSchema);
