const config = require('../../config/env.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const server = require('../../config/serverConfigs');
var mongoose = require('mongoose');
const { planTypes } = require('../../constants/planConstants');
const generateJwtToken = (payload) => {
  return jwt.sign({ payload }, config.SECRET_KEY, {
    expiresIn: '60d',
  });
};
const convertObjectId = (string) => {
  return mongoose.Types.ObjectId(string);
};
const validatePlan = (planType, startDate) => {
  let currentDate = new Date();
  let newStartDate = new Date(startDate);
  let checkValidPlan = {
    valid: false,
    days: 0,
  };
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const secondDate = new Date(
    newStartDate.getFullYear(),
    newStartDate.getMonth(),
    newStartDate.getDate()
  );
  const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
  checkValidPlan.days = diffDays;
  switch (planType) {
    case 'Trail': {
      if (diffDays >= 14) {
        checkValidPlan.valid = false;
        checkValidPlan.days = 0;
      } else {
        checkValidPlan.valid = true;
        checkValidPlan.days = 14 - checkValidPlan.days;
      }
      break;
    }
    case 'Premium': {
      if (diffDays >= 365) {
        checkValidPlan.valid = false;
        checkValidPlan.days = 0;
      } else {
        checkValidPlan.valid = true;
        checkValidPlan.days = 365 - checkValidPlan.days;
      }
      break;
    }
    case 'Enterprise': {
      if (diffDays >= 365) {
        checkValidPlan.valid = false;
        checkValidPlan.days = 0;
      } else {
        checkValidPlan.valid = true;
        checkValidPlan.days = 365 - checkValidPlan.days;
      }
      break;
    }
    case 'Startup': {
      if (diffDays >= 28) {
        checkValidPlan.valid = false;
        checkValidPlan.days = 0;
      } else {
        checkValidPlan.valid = true;
        checkValidPlan.days = 28 - checkValidPlan.days;
      }
      break;
    }
    default: {
      console.log('No plan Matched');
      checkValidPlan.valid = false;
      break;
    }
  }
  return checkValidPlan;
};

const verifyTenantEmail = async (adminDbConnection, body) => {
  try {
    let newOtp = Math.floor(100000 + Math.random() * 900000);
    console.log(adminDbConnection);
    const Otp = await adminDbConnection.model('Otp');
    const tenantEmail = body.email;
    const tenantPresent = await Otp.findOne({
      email: tenantEmail,
    });
    if (tenantPresent) {
      tenantPresent.otpExpireIn = new Date().getTime() + 2 * 60000;
      tenantPresent.otp = newOtp;
      tenantPresent.save();
    }
    let { email } = body;
    const newTenant = await new Otp({
      email,
      otp: newOtp,
      otpExpireIn: new Date().getTime() + 2 * 60000,
    }).save();
    return newTenant;
  } catch (error) {
    console.log('create Tenant otp error', error);
    throw error;
  }
};

const verifyEmailOtp = async (adminDbConnection, body) => {
  try {
    const Otp = await adminDbConnection.model('Otp');
    const tenantEmail = body.email;
    const tenantPresent = await Otp.findOne({
      email: tenantEmail,
    });
    if (tenantPresent) {
      var otpCheckTime =
        tenantPresent.otpExpireIn >= new Date().getTime() ? true : false;
      if (otpCheckTime) {
        if (tenantPresent.otp == body.otp) {
          tenantPresent.accountVerified = true;
          tenantPresent.otp = 0;
          tenantPresent.expireIn = new Date().getTime() + 3 * 60000;
          tenantPresent.save();
        } else {
          throw new Error('Otp invalided please try again');
        }
      } else {
        throw new Error('Otp time expired');
      }
    } else {
      throw new Error('User not found');
    }
    return tenantPresent;
  } catch (error) {
    console.log('create Tenant otp error', error);
    throw error;
  }
};
const registerTenant = async (adminDbConnection, body) => {
  try {
    const Tenant = await adminDbConnection.model('Tenant');
    const tenantEmail = body.email;
    const password = body.password;
    const hash_password = await bcrypt.hash(password, 10);
    const tenantPresent = await Tenant.findOne({
      email: tenantEmail,
    });
    if (tenantPresent) {
      throw new Error('Tenant already registered');
    }
    const newTenant = await new Tenant({
      email: tenantEmail,
      password: hash_password,
      story: 0,
    }).save();
    return newTenant;
  } catch (error) {
    console.log('createTenant error', error);
    throw error;
  }
};

const createTenantNew = async (adminDbConnection, req) => {
  try {
    const Tenant = await adminDbConnection.model('Tenant');
    const tenantPresent = await Tenant.findOne({
      email: req.body.email,
    });
    if (!tenantPresent) {
      const tenantList = await Tenant.find({});
      let businessCategory = req.body.businessCategory;
      let businessName = req.body.businessName.replace(/\s/g, '').toLowerCase();
      let customDomain = businessName + '_' + tenantList.length;
      let tenantCode = tenantList.length;

      const DB_URI =
        server.server_status === 'local'
          ? `mongodb+srv://${server.mongodb_user_name}:${server.mongodb_password}@cluster0.rqxjs.mongodb.net/${customDomain}?retryWrites=true&w=majority`
          : `mongodb+srv://${server.mongodb_user_name}:${server.mongodb_password}@fastbokz.in1grre.mongodb.net/${customDomain}?retryWrites=true&w=majority`;
      var randomId = Math.floor(1000 + Math.random() * 9000);
      const verificationToken = jwt.sign({ randomId }, config.SECRET_KEY, {
        expiresIn: '1d',
      });
      console.log(randomId, verificationToken);
      const hash_password = await bcrypt.hash(req.body.password, 10);
      let newData = {
        email: req.body.email,
        name: req.body.name,
        businessName: customDomain,
        businessCategory: businessCategory,
        customDomain: customDomain,
        tenantCode: tenantCode,
        subDomain: customDomain,
        dbName: customDomain,
        dbURI: DB_URI,
        country: req.body.country,
        timeZone: req.body.timeZone,
        planActivatedFullDate: req.body?.planActivatedFullDate,
        story: 1,
        planType: req.body.planType || 'Trail',
        planActivatedDate: req.body.planActivatedDate,
        clientUrl: `${config.LOCAL_CLIENT_URL}${customDomain}/scanner`,
        validPlan: true,
        brandName: req.body.brandName,
        timeSlots: req.body.timeSlots,
        currency: req.body.currency,
        verificationToken: {
          valid: true,
          token: verificationToken,
        },
        location: req.body.location,
        phone: {
          countryCode: req.body.phone.countryCode,
          phoneNumber: req.body.phone.phoneNumber,
        },
        deviceInfo: req.body.deviceInfo,
        accountVerified: true,
        accountStatus: true,
        password: hash_password,
        verificationToken: {
          valid: false,
          token: 'non',
        },
      };
      const tenantUpdate = await new Tenant(newData);
      tenantUpdate.save();
      let payload = {
        businessName: tenantUpdate.businessName,
        _id: tenantUpdate._id,
        email: tenantUpdate.email,
        dbName: tenantUpdate.dbName,
        customDomain: tenantUpdate.customDomain,
        planType: tenantUpdate.planType,
        validPlan: tenantUpdate.validPlan,
        startDate: tenantUpdate.createdAt,
        clientUrl: tenantUpdate?.clientUrl,
        currentDate: new Date(),
        brandName: req.body.brandName,
        timeSlots: req.body.timeSlots,
        currency: req.body.currency,
        verificationToken: {
          valid: true,
          token: verificationToken,
        },
      };
      const token = generateJwtToken(payload);
      return tenantUpdate;
    } else {
      throw new Error('Tenant already register');
    }
  } catch (error) {
    console.log('createTenant error', error);
    throw error;
  }
};

const createTenant = async (adminDbConnection, req) => {
  try {
    const Tenant = await adminDbConnection.model('Tenant');
    const tenantPresent = await Tenant.findOne({
      email: req.body.email,
    });
    if (!tenantPresent) {
      const tenantList = await Tenant.find({});
      let businessCategory = req.body.businessCategory;
      let businessName = req.body.businessName.replace(/\s/g, '').toLowerCase();
      let customDomain = businessName + '_' + tenantList.length;
      let tenantCode = tenantList.length;
      const DB_URI =
        server.server_status === 'local'
          ? `mongodb+srv://${server.mongodb_user_name}:${server.mongodb_password}@cluster0.rqxjs.mongodb.net/${customDomain}?retryWrites=true&w=majority`
          : `mongodb+srv://${server.mongodb_user_name}:${server.mongodb_password}@fastbokz.in1grre.mongodb.net/${customDomain}?retryWrites=true&w=majority`;
      var randomId = Math.floor(1000 + Math.random() * 9000);
      const verificationToken = jwt.sign({ randomId }, config.SECRET_KEY, {
        expiresIn: '1d',
      });
      console.log(randomId, verificationToken);
      let newData = {
        email: req.body.email,
        name: req.body.name,
        businessName: customDomain,
        businessCategory: businessCategory,
        customDomain: customDomain,
        tenantCode: tenantCode,
        subDomain: customDomain,
        dbName: customDomain,
        dbURI: DB_URI,
        country: req.body.country,
        timeZone: req.body.timeZone,
        planActivatedFullDate: req.body?.planActivatedFullDate,
        story: 1,
        planType: req.body.planType || 'Trail',
        planActivatedDate: req.body.planActivatedDate,
        clientUrl: `${config.LOCAL_CLIENT_URL}${customDomain}/scanner`,
        validPlan: true,
        brandName: req.body.brandName,
        timeSlots: req.body.timeSlots,
        currency: req.body.currency,
        verificationToken: {
          valid: true,
          token: verificationToken,
        },
      };
      const tenantUpdate = await new Tenant(newData);
      tenantUpdate.save();
      let payload = {
        businessName: tenantUpdate.businessName,
        _id: tenantUpdate._id,
        email: tenantUpdate.email,
        dbName: tenantUpdate.dbName,
        customDomain: tenantUpdate.customDomain,
        planType: tenantUpdate.planType,
        validPlan: tenantUpdate.validPlan,
        startDate: tenantUpdate.createdAt,
        clientUrl: tenantUpdate?.clientUrl,
        currentDate: new Date(),
        brandName: req.body.brandName,
        timeSlots: req.body.timeSlots,
        currency: req.body.currency,
        verificationToken: {
          valid: true,
          token: verificationToken,
        },
      };
      const token = generateJwtToken(payload);
      return tenantUpdate;
    } else {
      throw new Error('Tenant already register');
    }
  } catch (error) {
    console.log('createTenant error', error);
    throw error;
  }
};

const accountSetup = async (adminDbConnection, req) => {
  try {
    const Tenant = await adminDbConnection.model('Tenant');
    const tenantPresent = await Tenant.findOne({
      _id: convertObjectId(req.user_id),
    });
    if (!tenantPresent) {
      const hash_password = await bcrypt.hash(req.body.password, 10);
      let newData = {
        location: req.body.location,
        phone: {
          countryCode: req.body.phone.countryCode,
          phoneNumber: req.body.phone.phoneNumber,
        },
        deviceInfo: req.body.deviceInfo,
        accountVerified: true,
        accountStatus: true,
        password: hash_password,
        verificationToken: {
          valid: false,
          token: 'non',
        },
      };
      const tenantUpdate = await Tenant.findOneAndUpdate(
        { _id: req.user._id },
        newData,
        { new: true }
      );
      tenantUpdate.save();
      return tenantUpdate;
    } else {
      throw new Error('Account not found');
    }
  } catch (error) {
    console.log('Tenant account setup error', error);
    throw error;
  }
};

const resendAccountVerificationLink = async (adminDbConnection, req) => {
  try {
    const Tenant = await adminDbConnection.model('Tenant');
    const tenantPresent = await Tenant.findOne({
      email: req.body.email,
    });

    if (
      tenantPresent &&
      tenantPresent.verificationToken &&
      tenantPresent.verificationToken.valid
    ) {
      return tenantPresent;
    } else {
      throw new Error('Tenant not found');
    }
  } catch (error) {
    console.log('Tenant Not Found error', error);
    throw error;
  }
};

const getTenant = async (dbConnection, req) => {
  try {
    let _id = req.query._id;
    let Tenant = await dbConnection.model('Tenant');
    let tenantData = await Tenant.findOne({
      _id: _id,
      $nor: [{ story: '3' }],
    });
    if (tenantData) {
      var tenantNewData = JSON.parse(JSON.stringify(tenantData));
      planTypes.forEach((data) => {
        if (data.name == tenantNewData.planType) {
          tenantNewData.planType = data;
        }
      });
      return tenantNewData;
    } else {
      throw new Error('Tenant not found');
    }
  } catch (error) {
    console.log('Failed to get tenant error', error);
    throw error;
  }
};

const getTenantIdByName = async (dbConnection, req) => {
  try {
    let dbName = req.query.name;
    let Tenant = await dbConnection.model('Tenant');
    let tenantData = await Tenant.findOne({
      dbName: dbName,
      $nor: [{ story: '3' }],
    }).select('_id businessName');
    if (tenantData) {
      return tenantData;
    } else {
      throw new Error('Tenant not found');
    }
  } catch (error) {
    console.log('Failed to get tenant error', error);
    throw error;
  }
};

const editTenant = async (adminDbConnection, req) => {
  try {
    const Tenant = await adminDbConnection.model('Tenant');
    const tenantPresent = await Tenant.findById({
      _id: req.body._id,
    });
    if (tenantPresent) {
      let businessCategory = req.body.businessCategory;
      let newData = {
        name: req.body.name,
        businessCategory: businessCategory,
        brandName: req.body.brandName,
        timeSlots: req.body.timeSlots,
        currency: req.body.currency,
        location: req.body.location,
        timeZone: req.body.timeZone,
        socialMediaLinks: req.body.socialMediaLinks,
      };
      const tenantUpdate = await Tenant.findOneAndUpdate(
        { _id: req.body._id },
        newData,
        { new: true }
      );
      return tenantUpdate;
    } else {
      throw new Error('Tenant not found');
    }
  } catch (error) {
    console.log('EditTenant error', error);
    throw error;
  }
};

const updateTenantPlan = async (adminDbConnection, req) => {
  try {
    const Tenant = await adminDbConnection.model('Tenant');
    const tenantPresent = await Tenant.findById({
      _id: req.body._id,
    });
    if (tenantPresent) {
      tenantPresent.planType = req.body.planType;
      tenantPresent.planActivatedDate = req.body.planActivatedDate;
      tenantPresent.planActivatedFullDate = req.body.planActivatedFullDate;
      tenantPresent.save();
      return tenantPresent;
    } else {
      throw new Error('Tenant not found');
    }
  } catch (error) {
    console.log('EditTenant error', error);
    throw error;
  }
};

const resetPassword = async (adminDbConnection, body) => {
  try {
    const Tenant = await adminDbConnection.model('Tenant');
    const Otp = await adminDbConnection.model('Otp');
    const tenantEmail = body.email;
    const password = body.password;
    const hash_password = await bcrypt.hash(password, 10);
    const tenantPresent = await Tenant.findOne({
      email: tenantEmail,
    });
    const otpPresent = await Otp.findOne({
      email: tenantEmail,
    });
    if (tenantPresent) {
      var checkValid =
        otpPresent.expireIn >= new Date().getTime() &&
        otpPresent.expireIn == body.verifyId
          ? true
          : false;
      if (!checkValid) {
        throw new Error('Your otp time expired,Please verify your otp');
      }
      tenantPresent.password = hash_password;
      tenantPresent.activeSessions = [];
      tenantPresent.save();
      return tenantPresent;
    } else {
      throw new Error('Tenant not found');
    }
  } catch (error) {
    console.log('Reset Password error', error);
    throw error;
  }
};

const loginTenant = async (adminDbConnection, req) => {
  try {
    const Tenant = await adminDbConnection.model('Tenant');
    const tenantPresent = await Tenant.findOne({
      email: req.body.email,
      accountVerified: true,
    });
    const tenantAccountPresent = await Tenant.findOne({
      email: req.body.email,
    });
    if (tenantPresent) {
      const isPassword = await bcrypt.compare(
        req.body.password,
        tenantPresent.password
      );
      if (isPassword) {
        let isValidPlan = await validatePlan(
          tenantPresent.planType,
          tenantPresent.createdAt
        );

        if (isValidPlan.valid) {
          let activeSessions = tenantPresent.activeSessions;
          activeSessions.push({ details: req.body.sessionDetails });
          tenantPresent.activeSessions = activeSessions;
          await tenantPresent.save();
          let payload = {
            businessName: tenantPresent.businessName,
            _id: tenantPresent._id,
            email: tenantPresent.email,
            customDomain: tenantPresent.customDomain,
            dbName: tenantPresent.dbName,
            planType: tenantPresent.planType,
            validPlan: tenantPresent.validPlan,
            startDate: tenantPresent.createdAt,
            clientUrl: tenantPresent.clientUrl,
            currentDate: new Date(),
            daysRemaining: isValidPlan.days,
            sessionId: activeSessions[activeSessions.length - 1]._id,
            role: 'Admin',
          };
          const token = generateJwtToken(payload);
          return token;
        } else {
          throw new Error('Please upgrade your plan,your plan expired');
        }
      } else {
        throw new Error('Please enter valid password');
      }
    } else {
      if (tenantAccountPresent) {
        throw new Error(
          'Please click on the that has just been sent to your email account to verify your email and continue the login process.'
        );
      } else throw new Error('User is not valid');
    }
  } catch (error) {
    console.log('Login Tenant error', error);
    throw error;
  }
};

const logoutTenant = async (adminDbConnection, req) => {
  try {
    const Tenant = await adminDbConnection.model('Tenant');
    const tenantPresent = await Tenant.findOne({ _id: req.user.payload._id });
    if (tenantPresent) {
      tenantPresent.activeSessions = tenantPresent.activeSessions.filter(
        (session) => {
          if (req.body.sessionId != session._id) {
            return session;
          }
        }
      );
      await tenantPresent.save();
    } else {
      throw new Error('Tenant not found');
    }
  } catch (error) {
    console.log('Login Tenant error', error);
    throw error;
  }
};

const verifyTenantPassword = async (adminDbConnection, req) => {
  try {
    const Tenant = await adminDbConnection.model('Tenant');
    const tenantPresent = await Tenant.findOne({ email: req.body.email });
    if (tenantPresent) {
      const isPassword = await bcrypt.compare(
        req.body.password,
        tenantPresent.password
      );
      if (isPassword) {
        return isPassword;
      } else {
        throw new Error('Please enter valid password');
      }
    } else {
      throw new Error('User is not valid');
    }
  } catch (error) {
    console.log('Verify Tenant Password error', error);
    throw error;
  }
};

const changeTenantPassword = async (adminDbConnection, req) => {
  try {
    const Tenant = await adminDbConnection.model('Tenant');
    const tenantEmail = req.body.email;
    const password = req.body.password;
    const hash_password = await bcrypt.hash(password, 10);
    const tenantPresent = await Tenant.findOne({
      email: tenantEmail,
    });
    if (tenantPresent) {
      tenantPresent.password = hash_password;
      tenantPresent.activeSessions = tenantPresent.activeSessions.filter(
        (session) => {
          if (req.body.sessionId == session._id) {
            return session;
          }
        }
      );
      tenantPresent.save();
      return true;
    } else {
      throw new Error('Tenant not found');
    }
  } catch (error) {
    console.log('Change Password error', error);
    throw error;
  }
};

const getAllTenants = async (adminDbConnection) => {
  try {
    const Tenant = await adminDbConnection.model('Tenant');
    let query = {
      story: { $in: [1, 0, 2] },
      $nor: [{ role: 'superAdmin' }],
    };
    var tenants = await Tenant.find(query);
    var tenantsList = JSON.parse(JSON.stringify(tenants));
    tenantsList = tenantsList.map((data) => {
      data.planDetails = validatePlan(data.planType, data.planActivatedDate);
      return data;
    });
    return tenantsList;
  } catch (error) {
    console.log('getAllTenants error', error);
    throw error;
  }
};

const getSocialLinks = async (dbConnection, req) => {
  try {
    let _id = convertObjectId(req.query._id);
    let Tenant = await dbConnection.model('Tenant');
    let socialMediaLinks = await Tenant.findOne({
      _id: _id,
    }).select('socialMediaLinks');
    if (socialMediaLinks) {
      return socialMediaLinks;
    } else {
      throw new Error('Social media links not exists');
    }
  } catch (error) {
    console.log('Failed to get socialMediaLinks error', error);
    throw error;
  }
};

const updateSocialLinks = async (adminDbConnection, req) => {
  try {
    const Tenant = await adminDbConnection.model('Tenant');
    const tenantPresent = await Tenant.findById({
      _id: req.body._id,
    });
    let socialMediaLinks = req.body.socialMediaLinks;

    if (tenantPresent) {
      tenantPresent.socialMediaLinks = socialMediaLinks;
      tenantPresent.save();
      return { socialMediaLinks };
    } else {
      throw new Error('Tenant not found');
    }
  } catch (error) {
    console.log('Update Social Link error', error);
    throw error;
  }
};
const findWorkSpaceByTenantCode = async (adminDbConnection, req) => {
  try {
    let Tenant = await adminDbConnection.model('Tenant');
    let tenantData = await Tenant.findOne({
      tenantCode: req.query._id,
      $nor: [{ story: '3' }],
    }).select('_id dbName');
    if (tenantData) {
      return tenantData;
    } else {
      throw new Error('Tenant not found');
    }
  } catch (error) {
    console.log('Failed to get tenant error', error);
    throw error;
  }
};

module.exports = {
  getAllTenants,
  createTenant,
  createTenantNew,
  loginTenant,
  registerTenant,
  verifyTenantEmail,
  verifyEmailOtp,
  resetPassword,
  editTenant,
  getTenant,
  verifyTenantPassword,
  changeTenantPassword,
  getSocialLinks,
  updateSocialLinks,
  updateTenantPlan,
  logoutTenant,
  validatePlan,
  accountSetup,
  resendAccountVerificationLink,
  getTenantIdByName,
  findWorkSpaceByTenantCode
};
