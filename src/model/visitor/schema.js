const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
  address: {
    type: String,
    required: false,
    trim: true,
    min: 10,
    max: 100,
  },
  lattitude: {
    type: Number || String,
    required: false,
  },
  longitude: {
    type: Number || String,
    required: false,
  },
  apartmentNumber: {
    type: String,
    required: false,
    trim: true,
  },
  streetName: {
    type: String,
    required: false,
    trim: true,
  },
  country: {
    type: String,
    required: false,
    trim: true,
  },
  state: {
    type: Object,
    required: false,
  },
  city: {
    type: Object,
    required: false,
    trim: true,
  },
  pinCode: {
    type: String,
    required: false,
    trim: true,
  },
  location: {
    type: Object,
    required: false
  }
});

const sessionSchema = new mongoose.Schema({
  details: {
    type: Object,
    required: false,
  }
});

const visitorSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: false,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    token: {
      type: String,
      required: false,
    },
    story: {
      type: Number,
      required: false,
      default: 0,
    },
    role: {
      type: String,
      required: false
    },
    acceptTermsAndCondtions: {
      type: Boolean,
      required: false,
      default: true,
    },
    accountIdProofVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    address: {
      type: String,
      required: false
    },
    phoneNumber: {
      type: String,
      required: false
    },
    countryCode: {
      type: String,
      required: false
    },
    associateTenants: {
      type: Array,
      default: [],
      required: true,
    },
    accountVerified: {
      type: Boolean,
      required: false
    },
    otpVerify: {
      type: {
        status: {
          type: Boolean,
          required: false
        },
        time: {
          type: Date,
          required: false
        }
      }
    },
    location: {
      type: Object,
      required: false
    },
    device: {
      type: Object,
      required: false
    },
    visitorType: {
      type: String,
      required: false
    },
    activeSessions: {
      type: [sessionSchema],
      required: false
    },
  },
  { timestamps: true }
);

visitorSchema.index({
  visitorId: 1,
});

visitorSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  }
};

module.exports = mongoose.model("Visitor", visitorSchema);