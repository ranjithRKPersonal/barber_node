const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
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
    templateDetails: {
       type: Object,
       required: false
    },
    clientIds: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }],
        required: true,
    },
    story: {
        type: Number,
        required: true,
        default: 1 
    },
    deliveryStatus: {
        type: Object,
        required: false
    }
   },
   { timestamps: true }
);


module.exports = mongoose.model("Campaign", campaignSchema);
