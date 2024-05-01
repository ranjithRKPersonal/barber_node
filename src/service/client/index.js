const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../../logger/index');
const config = require('../../config/env.json');

const generateJwtToken = async (payload) => {
  return jwt.sign({ payload }, config.SECRET_KEY, {
    expiresIn: '60d',
  });
};

const createClient = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger createClient service ] ');
    const Client = await dbConnection.model('Client');
    let foundClient = await Client.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    let password = await bcrypt.hash(req.body.password, 10);

    let {
      firstName,
      lastName,
      email,
      gender,
      countryCode,
      phoneNumber,
      createdRole,
      dateOfBirth
    } = req.body;

    if (foundClient && foundClient.myClient)
      throw Error('Account Already Exists');
    else if (foundClient) {
      const newClient = await Client.findOneAndUpdate(
        { _id: foundClient._id },
        {
          $set: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            roleId: 1,
            gender: gender,
            countryCode: countryCode,
            phoneNumber: phoneNumber,
            password: password,
            createdRole: createdRole,
            dateOfBirth: dateOfBirth
          },
        },
        { new: true }
      );
      return newClient;
    } else {
      const newClient = new Client({
        firstName,
        lastName,
        email,
        gender,
        countryCode,
        phoneNumber,
        password,
        createdRole,
        roleId: 2,
        dateOfBirth
      });
      await newClient.save();
      return newClient;
    }
  } catch (error) {
    logger.error(' [ Failed createClient service ] ', error.message);
    throw new Error(error.message);
  }
};

const editClient = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger editClient service ] ');
    const Client = await dbConnection.model('Client');
    let {
      firstName,
      lastName,
      email,
      gender,
      countryCode,
      phoneNumber,
      password,
      dateOfBirth
    } = req.body;
    
    const duplicateClient = await Client.findOne({
      phoneNumber: phoneNumber,
    });
    if (duplicateClient && duplicateClient._id.toString() !== req.body._id) {
      throw new Error('Client already exits');
    }
    
    const newClient = await Client.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          gender: gender,
          countryCode: countryCode,
          phoneNumber: phoneNumber,
          password: password,
          dateOfBirth: dateOfBirth
        },
      },
      { new: true }
    );
    if (newClient) return newClient;
    else {
      throw Error('Failed editClient service');
    }
  } catch (error) {
    logger.error(' [ Failed editClient service ] ', error.message);
    throw new Error(error.message);
  }
};

const deleteClient = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger deleteClient service ] ');
    const Client = await dbConnection.model('Client');
    const newClient = await Client.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          story: 3,
        },
      },
      { new: true }
    );
    if (newClient) return newClient;
    else throw new Error('Client not found');
  } catch (error) {
    logger.error(' [ Failed deleteClient service ] ', error.message);
    throw new Error(error.message);
  }
};

const getSingleClient = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getSingleClient service ] ');
    const Client = await dbConnection.model('Client');
    const clientFound = await Client.findOne({
      _id: req.query._id,
      story: { $in: [1, 0, 2] },
    }).select(
      '_id firstName lastName email gender countryCode phoneNumber password createdRole dateOfBirth'
    );
    if (clientFound) return clientFound;
    else throw new Error('Failed getSingleClient');
  } catch (error) {
    logger.error(' [ Failed getSingleClient service ] ', error.message);
    throw new Error(error.message);
  }
};

const getAllClient = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllClient service ] ');
    const Client = await dbConnection.model('Client');
    const clientListFound = await Client.find({
      $nor: [
        {
          story: 3,
        },
      ],
    })
      .select(
        '_id firstName lastName email gender countryCode phoneNumber password createdRole createdAt dateOfBirth'
      )
      .sort({ createdAt: -1 });
    if (clientListFound) return clientListFound;
    else throw new Error('Failed getAllClient');
  } catch (error) {
    logger.error(' [ Failed getAllClient service ] ', error.message);
    throw new Error(error.message);
  }
};
const registerClient = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger registerClient service ] ');
    const Client = await dbConnection.model('Client');
    let foundClient = await Client.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    let {
      firstName,
      lastName,
      email,
      gender,
      countryCode,
      phoneNumber,
      createdRole,
      dateOfBirth
    } = req.body;
    let password = await bcrypt.hash(req.body.password, 10);

    if (foundClient && foundClient.myClient)
      throw Error('Account Already Exists');
    else if (foundClient) {
      const newClient = await Client.findOneAndUpdate(
        { _id: foundClient._id },
        {
          $set: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            gender: gender,
            countryCode: countryCode,
            phoneNumber: phoneNumber,
            password: password,
            createdRole: createdRole,
            roleId: 1,
            dateOfBirth: dateOfBirth
          },
        },
        { new: true }
      );
      return newClient;
    } else {
      const newClient = new Client({
        firstName,
        lastName,
        email,
        gender,
        countryCode,
        phoneNumber,
        password,
        createdRole,
        roleId: 2,
        dateOfBirth
      });

      const registerClient = await newClient.save();
      let payload = {
        _id: registerClient._id,
        firstName: registerClient.firstName,
        lastName: registerClient.lastName,
        gender: registerClient.gender,
        countryCode: registerClient.countryCode,
        phoneNumber: registerClient.phoneNumber,
        role: registerClient.role,
        dateOfBirth: registerClient.dateOfBirth
      };

      const token = await generateJwtToken(payload);
      return token;
    }
  } catch (error) {
    logger.error(' [ Failed registerClient service ] ', error.message);
    throw new Error(error.message);
  }
};

const loginClient = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger registerClient service ] ');

    const client = await dbConnection.model('Client');
    const visitorPresent = await client.findOne({
      phoneNumber: {
        $in: [
          req.body.phoneNumber,
          `${req.body.countryCode}${req.body.phoneNumber}`,
        ],
      },
      $nor: [{ story: '3' }],
    });
    console.log('+++', visitorPresent);

    if (visitorPresent) {
      if (!visitorPresent.password) {
        throw new Error('Please enter valid password');
      }
      const isPassword = await bcrypt.compare(
        req.body.password,
        visitorPresent.password
      );
      if (isPassword) {
        let activeSessions = visitorPresent.activeSessions || [];
        activeSessions.push({ details: req.body.sessionDetails });
        visitorPresent.activeSessions = activeSessions;
        await visitorPresent.save();
        let payload = {
          _id: visitorPresent._id,
          firstName: visitorPresent.firstName,
          lastName: visitorPresent.lastName,
          gender: visitorPresent.gender,
          countryCode: visitorPresent.countryCode,
          phoneNumber: visitorPresent.phoneNumber,
          role: visitorPresent.role,
        };
        const token = generateJwtToken(payload);
        return token;
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

const getSingleTenantDetails = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getSingle tenant details service ] ');
    let dbName = req.query.name;
    let Tenant = await dbConnection.model('Tenant');
    let tenantData = await Tenant.findOne({
      dbName: dbName,
      $nor: [{ story: '3' }],
    }).select(
      '_id businessName email location socialMediaLinks timeSlots brandName dbName phone storeLogo'
    );
    var tenantNewData = JSON.parse(JSON.stringify(tenantData));
    // return token;
    if (tenantData) {
      const token = generateJwtToken(tenantData);
      return token;
    } else {
      throw new Error('Tenant not found');
    }
  } catch (error) {
    console.log('Failed to get tenant error', error);
    throw error;
  }
};


const bulkCreateClient = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger registerClient service ] ');
    const Client = await dbConnection.model('Client');
    let skipedClients = [];
    const existingPhoneNumbers = new Set((await Client.find({}, { phoneNumber: 1 })).map((user) => user.phoneNumber));
    const users = {};
    console.log("______req.body.clientList_________",req.body.clientList.length);
    for (let [index,result] of req.body.clientList.entries()) {
      // Check if email already exists
      if (existingPhoneNumbers.has(result.phoneNumber)) {
        console.log(`Skipping user ${result.phoneNumber}, phoneNumber already exists`);
        skipedClients.push(result);
        continue;
      }

      // If email doesn't exist, add the user to the users object
      console.log("____phoneNumber____",result,index);
      const newUser = {
        firstName: (result?.firstName == ''  || result?.firstName == ' ' || result?.firstName == null) ? '' : result.firstName   ,
        lastName: result.lastName,
        gender: result.gender,
        email: result.email,
        phoneNumber: result.phoneNumber,
        password: await bcrypt.hash(result.phoneNumber.substring(0, 4), 10),
        countryCode: '91',
        createdRole: "Admin",
        myClient: true,
        roleId: 1,
      };
      if (!users[result.phoneNumber]) {
        users[result.phoneNumber] = newUser;
      } else {
        // If phoneNumber already exists in users object, merge the user data
        skipedClients.push(result);
        Object.assign(users[result.phoneNumber], newUser);
      }
    }

    const newUsers = Object.values(users);
    if (newUsers.length > 0) {
      console.log("_____newUsers______",newUsers.length);
      await Client.insertMany(newUsers);
    }
  
    return { importedClientsCounts:newUsers.length ,  skipedClientsCounts: skipedClients.length,  importedClients :newUsers ,  skipedClients: skipedClients};
  }
  catch (error) {
    logger.error(' [ Failed registerClient service ] ', error.message);
    throw new Error(error.message);
  }
};


module.exports = {
  createClient,
  editClient,
  deleteClient,
  getSingleClient,
  getAllClient,
  registerClient,
  loginClient,
  getSingleTenantDetails,
  bulkCreateClient
};
