const mongoose = require("mongoose");

const requestDemoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    businessCategory: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },

    createByRole: {
      type: String,
      required: false,
    },
    createdDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);
requestDemoSchema.index({
  requestDemoId: 1,
});

module.exports = mongoose.model("RequestDemo", requestDemoSchema);
