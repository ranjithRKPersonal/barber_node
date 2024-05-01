const mongoose = require("mongoose");

const taxSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    percentage: {
        type: Number,
        required: true
    },
    story: {
        type: Number,
        required: true,
        default: 1 
    },
    gstNumber: {
        type: String,
        required: false
    }
   },
   { timestamps: true }
);


module.exports = mongoose.model("Tax", taxSchema);
