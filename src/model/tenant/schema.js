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
});

const sessionSchema = new mongoose.Schema({
  details: {
    type: Object,
    required: false,
  }
});

const tenantSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
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
    businessName: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    businessCategory: {
      type: Object,
      required: false,
    },
    dbURI: {
      type: String,
      required: false,
      trim: true,
      unique: true,
    },
    tenantCode: {
      type: String,
      required: false,
      unique: true,
    },
    subDomain: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    customDomain: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    dbName: {
      type: String,
      required: false,
      unique: true,
    },
    token: {
      type: String,
      required: false,
    },
    planType: {
      type: String,
      required: true,
      enum: ["Trail","Premium","Enterprise","Startup"],
      default: "Trail"
    },
    planActivatedDate: {
      type: Date,
      required: false
    },
    clientUrl: {
      type: String,
      required: false
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
    country: {
      type: Object,
      required: false,
    },
    validPlan: {
      type: Boolean,
      required: true,
      default: true,
    },
    address: [addressSchema | String | Object],
    storeLogo: {
      type: String,
      required: false,
    },
    phone: {
      type: Object,
      required: false,
    },
    socialMediaLinks: {
      type: Array,
      required: false,
    },
    planActivatedFullDate: {
      type: Date,
      required: false
    },
    mainBranch: {
      type: Boolean,
      required: true,
      default: true
    },
    subBranches: {
      type: Array,
      required: false
    },
    location: {
      type: Object, // location name and details
      required: false
    },
    activeSessions: {
      type: [sessionSchema],
      required: false
    },
    deviceInfo: {
      type: Object,
      required: false
    },
    accountVerified: { // Mail link verification status
      type: Boolean,
      required: false
    },
    accountStatus: { // Active or In active
      type: Boolean,
      required: false
    },
    country: {
      type: String,
      required: false
    },
    timeZone: {
      type: Object,
      required: false
    },
    verificationToken: {
      type: {
        valid: {
          type: Boolean,
          required: false
        },
        token: {
          type: Boolean,
          required: false
        }
      },
      required: false
    },
    timeSlots: {
      type: Array,
      required: false,
      default: []
    },
    currency: {
      type: Object,
      required: false
    },
    brandName: {
      type: String,
      required: false
    },
    socialMediaLinks: {
      type: Array,
      required: false
    }
  },
  { timestamps: true }
);

tenantSchema.index({
  tenantId: 1,
});

tenantSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  },
};

module.exports = mongoose.model("Tenant", tenantSchema);
