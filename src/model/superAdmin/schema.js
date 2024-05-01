const mongoose = require("mongoose");

const superAdminSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: false
    },
    email: {
       type: String,
       required: true,
       unique: true
    },
    password: {
        type: String,
        required: true
    }
  },

  { timestamps: true }
);

superAdminSchema.index({
    superAdminId: 1
});

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
