const bcrypt = require("bcrypt");
const config = require("../../config/env.json");
const jwt = require("jsonwebtoken");
const { BaseUrl, SubUrl } = require("../../constants/statusConstants");
const { default: axios } = require("axios");

const generateJwtToken = async (payload) => {
  return jwt.sign({ payload }, config.SECRET_KEY, {
    expiresIn: "60d",
  });
};

const registerVisitor = async (adminDbConnection, req) => {
  try {
    const Visitor = await adminDbConnection.model("Visitor");
    const Otp = await adminDbConnection.model("Otp");
    const {
      password,
      email,
      address,
      phoneNumber,
      name,
      location,
      device,
      countryCode,
    } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const fullNumber = `${req.body.countryCode}${req.body.phoneNumber}`;
    const tenantPresent = await Visitor.findOne({
      phoneNumber: { $in: [req.body.phoneNumber, fullNumber] },
      $nor: [{ story: "3" }],
    });
    console.log(tenantPresent);
    var validOtpVerify = await Otp.findOne({
      phoneNumber: { $in: [req.body.phoneNumber, fullNumber] },
    });

    if (validOtpVerify) {
      var checkValid =
        validOtpVerify.expireIn >= new Date().getTime() &&
        req.body.verifyId == validOtpVerify.expireIn
          ? true
          : false;
      if (!checkValid) {
        throw new Error("Your otp time expired,Please verify your otp");
      }
    }
    if (!tenantPresent) {
      throw new Error("Visitor not verified");
    } else if (tenantPresent && tenantPresent.accountVerified == true) {
      throw new Error("Visitor already registered");
    } else {
      const visitorPresent = await Visitor.findOneAndUpdate(
        { _id: tenantPresent._id },
        {
          $set: {
            email: email,
            password: hash_password,
            story: 0,
            accountVerified: true,
            address: address,
            name: name,
            location: location,
            device: device,
          },
        }
      );
      if (visitorPresent) {
        const url = `${BaseUrl.MSG_91}${SubUrl.SEND_SINGLE_SMS}?
        template_id=${config.MSG_91_TEMPLATE_REGISTER_ID}
        &authkey=${config.MSG_91_AUTH_KEY}`;
        var reqDetail = {
          method: "post",
          url: url,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=utf-8",
          },
          data: {
            flow_id: config.MSG_91_REGISTER_VISITOR_FLOW_ID,
            sender: config.MSG_91_SENDER_ID,
            mobiles: fullNumber,
            NAME: ` : ${req.body.name.toUpperCase()}`,
            template_id: config.MSG_91_TEMPLATE_REGISTER_ID,
          },
        };
        var otpResponse = await axios(reqDetail);
        let payload = {
          _id: visitorPresent._id,
          name: name,
          address: address,
          phoneNumber: visitorPresent.phoneNumber,
          countryCode: visitorPresent.countryCode
            ? visitorPresent.countryCode
            : 91,
          role: "Client",
        };
        const token = await generateJwtToken(payload);
        return token;
      } else {
        throw new Error("Visitor registration failed");
      }
    }
  } catch (error) {
    console.log("Visitor registration failed error", error);
    throw error;
  }
};

const updateVisitorAssociateTenants = async (adminDbConnection, req) => {
  try {
    const Visitor = await adminDbConnection.model("Visitor");
    const tenantPresent = await Visitor.findOne({
      _id: req.body._id,
      associateTenants: { $in: [req.body.tenantId] },
    });
    if (tenantPresent) {
      return tenantPresent;
    } else {
      const updatedVisitor = await Visitor.findOneAndUpdate(
        { _id: req.body._id },
        { $push: { associateTenants: req.body.tenantId } },
        (err, data) => {
          if (err) {
            throw new Error("Failed to update visitor associate");
          } else {
            return data;
          }
        }
      );
      if (updatedVisitor) return updatedVisitor;
      else {
        throw new Error("Failed to update visitor associate");
      }
    }
  } catch (error) {
    console.log("Failed to update visitor associate error", error);
    throw error;
  }
};

const loginVisitor = async (adminDbConnection, req) => {
  try {
    const Visitor = await adminDbConnection.model("Visitor");
    const visitorPresent = await Visitor.findOne({
      phoneNumber: {
        $in: [
          req.body.phoneNumber,
          `${req.body.countryCode}${req.body.phoneNumber}`,
        ],
      },
      $nor: [{ story: "3" }],
    });
    if (visitorPresent) {
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
          name: visitorPresent.name,
          address: visitorPresent.address,
          phoneNumber: visitorPresent.phoneNumber,
          countryCode: visitorPresent.countryCode
            ? visitorPresent.countryCode
            : 91,
          role: "Client",
        };
        const token = generateJwtToken(payload);
        return token;
      } else {
        throw new Error("Please enter valid password");
      }
    } else {
      throw new Error("Visitor not found");
    }
  } catch (error) {
    console.log("Login visitor error", error);
    throw error;
  }
};

const resetVisitorPassword = async (adminDbConnection, req) => {
  try {
    const Visitor = await adminDbConnection.model("Visitor");
    const Otp = await adminDbConnection.model("Otp");
    var fullNumber = req.body.phoneNumber;
    if (req.body.countryCode)
      fullNumber = `${req.body.countryCode}${req.body.phoneNumber}`;
    var validOtpVerify = await Otp.findOne({
      phoneNumber: { $in: [req.body.phoneNumber, fullNumber] },
    });
    if (validOtpVerify) {
      var checkValid =
        validOtpVerify.expireIn >= new Date().getTime() &&
        validOtpVerify.expireIn == req.body.verifyId
          ? true
          : false;
      if (!checkValid) {
        throw new Error("Your otp time expired,Please verify your otp");
      }
    }
    const visitorPresent = await Visitor.findOne({
      phoneNumber: { $in: [req.body.phoneNumber, fullNumber] },
      $nor: [{ story: "3" }],
    });
    if (visitorPresent) {
      const hash_password = await bcrypt.hash(req.body.password, 10);
      visitorPresent.password = hash_password;
      await visitorPresent.save();
      return "Visitor password updated";
    } else {
      throw new Error("Visitor not found");
    }
  } catch (error) {
    console.log("Reset visitor password error", error);
    throw error;
  }
};

const visitorVisitList = async (adminDbConnection, req) => {
  try {
    const Visitor = await adminDbConnection.model("Visitor");
    const Tenant = await adminDbConnection.model("Tenant");
    var visitorId = req.query._id;
    const visitorPresent = await Visitor.findOne({
      _id: visitorId,
    });
    if (visitorPresent) {
      var tenantIds = [...new Set(visitorPresent.associateTenants)];
      var tenantList = await Tenant.find({
        _id: { $in: tenantIds },
      }).select("_id businessName validPlan address");
      return tenantList;
    } else {
      throw new Error("Visitor not found");
    }
  } catch (error) {
    console.log("Visitor not found error", error);
    throw error;
  }
};

const findClient = async (adminDbConnection, req) => {
  try {
    const Visitor = await adminDbConnection.model("Client");
    var phoneNumber = req.query.phoneNumber;
    const visitorPresent = await Visitor.findOne({
      phoneNumber: phoneNumber,
    }).select("_id firstName lastName gender countryCode phoneNumber email");
    if (visitorPresent) {
      return visitorPresent;
    } else {
      throw new Error("New Client");
    }
  } catch (error) {
    console.log("Client not found error", error);
    throw error;
  }
};

module.exports = {
  registerVisitor,
  updateVisitorAssociateTenants,
  loginVisitor,
  resetVisitorPassword,
  visitorVisitList,
  findClient,
};
