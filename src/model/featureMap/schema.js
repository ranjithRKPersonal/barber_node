const mongoose = require("mongoose");

const featureMapSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    value: {
        type: Boolean,
        required: true
    },
    story: {
        type: Number,
        required: true,
        default: 1 
    },
   },
   { timestamps: true }
);


module.exports = mongoose.model("FeatureMap", featureMapSchema);
