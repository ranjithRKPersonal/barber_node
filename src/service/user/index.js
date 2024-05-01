const logger = require('../../logger/index');
const bcrypt = require('bcrypt');
const config = require('../../config/env.json');
const jwt = require('jsonwebtoken');

const generateJwtToken = async (payload) => {
  return jwt.sign({ payload }, config.SECRET_KEY, {
    expiresIn: '60d',
  });
};

const createUser = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger createUser service ] ');
    const User = await dbConnection.model('User');
    let foundClient = await User.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    let password = await bcrypt.hash(req.body.password, 10);
    let createdRole = 'Admin';
    let role = 'Staff';
    let { firstName, phoneNumber, countryCode, designation } = req.body;
    if (foundClient) throw Error('Staff Already Exists');
    else {
      const newUser = new User({
        firstName,
        password,
        countryCode,
        phoneNumber,
        designation,
        createdRole,
        role,
      });
      await newUser.save();
      return newUser;
    }
  } catch (error) {
    logger.error(' [ Failed createStaff service ] ', error.message);
    throw new Error(error.message);
  }
};

const getAllStaff = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllStaff service ] ');
    const Client = await dbConnection.model('User');
    const clientListFound = await Client.find({
      $nor: [
        {
          story: 3,
        },
      ],
    })
      .select(
        '_id firstName countryCode designation phoneNumber password createdRole createdAt role story'
      )
      .sort({ createdAt: -1 });
    if (clientListFound) return clientListFound;
    else throw new Error('Failed getAllStaff');
  } catch (error) {
    logger.error(' [ Failed getAllStaff service ] ', error.message);
    throw new Error(error.message);
  }
};

const editStaff = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger editStaff service ] ');
    const Service = await dbConnection.model('User');
    const id = req.body._id;
    const updatedUser = req.body;
    // Retrieve the original record
    const originalUser = await Service.findById(id);
    if (!originalUser) {
      throw new Error('Staff not found.');
    }
    // Check for duplicates
    const staffPhoneNumber = updatedUser.phoneNumber;
    const duplicateUser = await Service.findOne({
      phoneNumber: staffPhoneNumber,
    });
    if (duplicateUser && duplicateUser._id.toString() !== id) {
      throw new Error('Staff already exits');
    }
    let { firstName, countryCode, phoneNumber, designation } = req.body;
    const newService = await Service.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          firstName: firstName,
          countryCode: countryCode,
          phoneNumber: phoneNumber,
          designation: designation,
        },
      },
      { new: true }
    );
    if (newService) return newService;
    else throw Error('Failed editStaff service  ');
  } catch (error) {
    logger.error(' [ Failed editStaff service ] ', error.message);
    throw new Error(error.message);
  }
};

const deactivateStaff = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger editStaff service ] ');
    const Service = await dbConnection.model('User');
    const id = req.body._id;
    const updatedUser = req.body;
    // Retrieve the original record
    const originalUser = await Service.findById(id);
    if (!originalUser) {
      throw new Error('Staff not found.');
    }
    // Check for duplicates
    const staffPhoneNumber = updatedUser.phoneNumber;
    const duplicateUser = await Service.findOne({
      phoneNumber: staffPhoneNumber,
    });
    if (duplicateUser && duplicateUser._id.toString() !== id) {
      throw new Error('Staff already exits');
    }

    const newService = await Service.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          story: 4,
        },
      },
      { new: true }
    );
    if (newService) return newService;
    else throw Error('Failed deactivateStaff service  ');
  } catch (error) {
    logger.error(' [ Failed deactivateStaff service ] ', error.message);
    throw new Error(error.message);
  }
};

const getSingleStaff = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getSingleStaff service ] ');
    const staff = await dbConnection.model('User');
    const categoryFound = await staff
      .findOne({
        _id: req.query._id,
        story: { $in: [1, 0, 2, 4] },
      })
      .select(
        '_id firstName countryCode designation phoneNumber password createdRole createdAt role'
      );
    if (categoryFound) return categoryFound;
    else throw new Error('Failed getSingleStaff');
  } catch (error) {
    logger.error(' [ Failed getSingleStaff service ] ', error.message);
    throw new Error(error.message);
  }
};

const staffLogin = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger registerClient service ] ');

    const client = await dbConnection.model('User');
    const staffPresent = await client.findOne({
      phoneNumber: {
        $in: [
          req.body.phoneNumber,
          `${req.body.countryCode}${req.body.phoneNumber}`,
        ],
      },
      story: { $in: [1, 0, 2] },
    });
    console.log('+++', staffPresent);
    if (staffPresent) {
      if (!staffPresent.password) {
        throw new Error('Please enter valid password');
      }
      const isPassword = await bcrypt.compare(
        req.body.password,
        staffPresent.password
      );
      if (isPassword) {
        let activeSessions = staffPresent.activeSessions || [];
        activeSessions.push({ details: req.body.sessionDetails });
        staffPresent.activeSessions = activeSessions;
        await staffPresent.save();
        let payload = {
          staffId: staffPresent._id,
          firstName: staffPresent.firstName,
          lastName: staffPresent.lastName,
          gender: staffPresent.gender,
          countryCode: staffPresent.countryCode,
          phoneNumber: staffPresent.phoneNumber,
          role: 'Staff',
          sessionId: activeSessions[activeSessions.length - 1]._id,
        };
        return payload;
      } else {
        throw new Error('Please enter valid password');
      }
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.log('Login user error', error);
    throw error;
  }
};

const staffLoginWithAdminData = async (dbConnection, req, payloadData) => {
  try {
    logger.info(' [ Trigger registerClient service ] ');
    const Tenant = await dbConnection.model('Tenant');
    const tenantPresent = await Tenant.findOne({
      dbName: req.headers.tenant,
    });
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
      daysRemaining: 30,
      role: 'Staff',
      ...payloadData,
    };
    const token = generateJwtToken(payload);
    return token;
  } catch (error) {
    console.log('Login user error', error);
    throw error;
  }
};

module.exports = {
  createUser,
  editStaff,
  getAllStaff,
  getSingleStaff,
  staffLogin,
  staffLoginWithAdminData,
  deactivateStaff,
};
