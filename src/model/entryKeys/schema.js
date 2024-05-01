const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema(
  {
    scanId: {
      type: String,
      required: true,
      unique: true
    },
    expireIn: {
        type: Date,
        index: true,
        required: true,
        default: new Date(),
        expires: 60
    },
    valid: {
      type: Boolean,
      required: true,
      default: true
    }
  }
);

scanSchema.index({expireIn: 1}, {expireAfterSeconds: 60});

module.exports = mongoose.model("ScanSchema", scanSchema);
