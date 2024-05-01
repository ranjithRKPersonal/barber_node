const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
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
    story: {
        type: Number,
        required: true,
        default: 1 
    }
   },
   { timestamps: true }
);

categorySchema.index({
    categoryId : 1
});

module.exports = mongoose.model("Category", categorySchema);
