const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  details: {
    type: Object,
    required: false,
  },
});

const clientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    gender: {
      type: String,
      required: false,
      enum: ['Male', 'Female'],
    },
    dateOfBirth: {
      type: Date,
      required: false
    },
    email: {
      type: String,
      required: false,
      trim: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
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
    createdRole: {
      type: String,
      required: false,
    },
    acceptTermsAndCondtions: {
      type: Boolean,
      required: false,
      default: true,
    },
    accountIdProofVerified: {
      type: Boolean,
      required: false,
      default: false,
    },
    address: {
      type: String,
      required: false,
    },
    countryCode: {
      type: String,
      required: true,
    },
    accountVerified: {
      type: Boolean,
      required: false,
    },
    otpVerify: {
      type: {
        status: {
          type: Boolean,
          required: false,
        },
        time: {
          type: Date,
          required: false,
        },
      },
    },
    activeSessions: {
      type: [sessionSchema],
      required: false,
    },
    roleId: {
      type: Number,
      required: true,
      default: 1, // 1 Guest 2 Client 3 Member
    },
    myClient: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

clientSchema.index({
  visitorId: 1,
});

clientSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  },
};

module.exports = mongoose.model('Client', clientSchema);
