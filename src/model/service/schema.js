const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
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
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    serviceGender: {
        type: String,
        required: true,
        enum: ["All","Male","Female"],
        default: "All"
    },
    onlineBooking: {
        type: Boolean,
        required: true,
        default: true
    },
    story: {
        type: Number,
        required: true,
        default: 1 
    },
    location : {
        type: Object,
        required: false
    },
    team : {
        type: Object,
        required: false
    }, 
    priceAndDuration: {
        type: Array,
        required: true
    },
    tax: {
        type:Object,
        required: true,
        default: {
            rate: 0
        }
    }
   },
   { timestamps: true }
);

serviceSchema.index({
    serviceId : 1
});

module.exports = mongoose.model("Service", serviceSchema);
