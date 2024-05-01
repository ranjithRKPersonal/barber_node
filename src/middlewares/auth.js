const { getConnection } = require("../connectionManager");
const { STATUS } = require("../constants/statusConstants");
const { db } = require("../model/tenant/schema");
const config = require("../config/env.json");
const jwt = require("jsonwebtoken");
const { default: jwtDecode } = require("jwt-decode");
const { validatePlan } = require("../service/tenant");
const logger = require("../logger/index.js");

exports.requireAdminSignin = async (req, res, next) => {
  try {
    console.log("Trigger signin middleware");
    if (req.headers.authorization) {
      const dbConnection = getConnection();
      const token = req.headers.authorization.split(" ")[1];
      const user = jwt.verify(token, config.SECRET_KEY);
      if (user) {
        req.user = user;
        req.dbConnection = dbConnection;
        next();
      } else {
        throw new Error("Admin access denied");
      }
    } else {
      throw new Error("Token is required");
    }
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).send({
      msg: "Super admin access denied",
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

exports.requireVerifyClient = async (req, res, next) => {
  try {
    console.log("Trigger verify client");
    if (req.headers.authorization) {
      var dbConnection = getConnection();
      const token = req.headers.authorization.split(" ")[1];
      const user = jwt.verify(token, config.SECRET_KEY);
      const Tenant = await dbConnection.model("Tenant");
      console.log("Tenant", Tenant);
      const tenantPresent = await Tenant.find({});
      console.log(tenantPresent);
      if (tenantPresent) {
        console.log(tenantPresent.planType, tenantPresent.startDate);
        var check = await validatePlan(
          tenantPresent.planType,
          tenantPresent.startDate
        );
        console.log("check", check);
      }

      if (user) {
        req.user = user;
        return res.status(200).send({
          msg: "Token Valid ",
          success: STATUS.SUCCESS,
          statusCode: STATUS.POST_SUCCESS,
          data: { validToken: true },
        });
      } else {
        throw new Error("Token invalid");
      }
    } else {
      throw new Error("Token is required");
    }
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).send({
      msg: "Access denied token invalid",
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

exports.requireVerifyTenant = async (req, res, next) => {
  try {
    console.log("Trigger verify token");
    if (req.headers.authorization) {
      var dbConnection = getConnection().name;
      const token = req.headers.authorization.split(" ")[1];
      const user = jwt.verify(token, config.SECRET_KEY);
      const Tenant = await dbConnection.model("Tenant");
      const tenantPresent = await Tenant.findOne({
        businessName: req.headers.tenant,
      });
      if (tenantPresent) {
        var check = await validatePlan(
          tenantPresent.planType,
          tenantPresent.startDate
        );
        console.log("check", check);
      }

      if (user) {
        req.user = user;
        return res.status(200).send({
          msg: "Token Valid ",
          success: STATUS.SUCCESS,
          statusCode: STATUS.POST_SUCCESS,
          data: { validToken: true },
        });
      } else {
        throw new Error("Token invalid");
      }
    } else {
      throw new Error("Token is required");
    }
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).send({
      msg: "Access denied token invalid",
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

exports.checkScanEntryKey = async (req, res, next) => {
  const dbConnection = await getConnection();
  const SacnKey = dbConnection.model("ScanSchema");
  let checkSacnKey = await SacnKey.findOne({
    _id: req.body.entryKey,
  });
  console.log("checkSacnKey", checkSacnKey);
  if (checkSacnKey && checkSacnKey.valid) {
    checkSacnKey.valid = false;
    checkSacnKey.save();
    req.dbConnection = dbConnection;
    return true;
  } else {
    throw new Error("Entry access denied");
  }
};

exports.requireTenantSignin = (req, res, next) => {
  try {
    logger.info(" [ Trigger requireTenantSignin Middleware ] ", { meta: 1 });
    if (req.headers.authorization) {
      const dbConnection = getConnection();
      const token = req.headers.authorization.split(" ")[1];
      const user = jwt.verify(token, config.SECRET_KEY);
      var userData = jwtDecode(token);
      if (user) {
        req.user = user;
        req.dbConnection = dbConnection;
        next();
      } else {
        logger.error(" [requireTenantSignin Tenant access denied ] ");
        throw new Error("Tenant access denied");
      }
    } else {
      logger.error(" [requireTenantSignin Tenant Token is required ] ");
      throw new Error("Token is required");
    }
  } catch (error) {
    logger.error(" [requireTenantSignin Tenant access denied ] ");
    return res.status(error.statusCode || 500).send({
      msg: "Tenant access denied",
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: error.message,
    });
  }
};

exports.requireTenantConnection = (req, res, next) => {
  try {
    logger.info(" [ Trigger requireTenantConnection Middleware ] ", { meta: 1 });
      console.log("___HEADERS____",req.headers.tenant)
      const dbConnection = getConnection();
      req.dbConnection = dbConnection;
      next();
  } catch (error) {
    logger.error(" [requireTenantConnection Tenant access denied ] ");
    return res.status(error.statusCode || 500).send({
      msg: "Tenant access denied",
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: error.message,
    });
  }
};

exports.requireClientSignin = (req, res, next) => {
  try {
    logger.info(" [ Trigger requireClientSignin Middleware ] ", { meta: 1 });
    if (req.headers.authorization) {
      const dbConnection = getConnection();
      const token = req.headers.authorization.split(" ")[1];
      const user = jwt.verify(token, config.SECRET_KEY);
      var userData = jwtDecode(token);
      if (user && userData.payload) {
        req.user = user;
        req.dbConnection = dbConnection;
        next();
      } else {
        logger.error(" [requireClientSignin access denied ] ");
        throw new Error("Tenant access denied");
      }
    } else {
      logger.error(" [requireClientSignin Token is required ] ");
      throw new Error("Token is required");
    }
  } catch (error) {
    logger.error(" [requireClientSignin  access denied ] ");
    return res.status(error.statusCode || 500).send({
      msg: "Client access denied",
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: error.message,
    });
  }
};

exports.tenantMiddleware = async (req, res, next) => {
  try {
    const dbConnection = getConnection();
    const Tenant = dbConnection.model("Tenant");
    const tenantPresent = await Tenant.findOne({
      email: req.body.email,
    });
    if (tenantPresent) {
      req.dbConnection = dbConnection;
      req.user = tenantPresent;
      next();
    } else {
      throw new Error("Tenant not registered..");
    }
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).send({
      msg: "Tenant not registered..",
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

exports.verifyAccountActivationLink = async (req, res, next) => {
  try {
    const dbConnection = await getConnection();
    const Tenant = dbConnection.model("Tenant");
    const token = req.body.token;
    const user = jwt.verify(token, config.SECRET_KEY);
    if (user) {
      const tenantFound = await Tenant.findOne({
        "verificationToken.token": token,
        "verificationToken.valid": true,
      });
      if (tenantFound) {
        req.user = { _id: tenantFound._id };
        req.dbConnection = dbConnection;
        logger.info(" [ Trigger verify Account Activation Link Middleware ] ", {
          meta: 1,
        });

        next();
      } else {
        throw new Error(
          "Verification link expired,please contact administrator"
        );
      }
    } else {
      throw new Error("Verification link expired,please contact administrator");
    }
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).send({
      msg: "Verification link expired,please contact administrator",
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

exports.verifyOtpActivation = async (req, res, next) => {
  try {
    logger.info(" [ Trigger verify otp activation Start  Middleware ] ", {
      meta: 1,
    });
    const dbConnection = req.dbConnection;
    const Otp = dbConnection.model("Otp");
    var validOtpVerify = await Otp.findOne({
      phoneNumber: {
        $in: [
          req.body.phone.phoneNumber,
          `${req.body.phone.countryCode}${req.body.phone.phoneNumber}`,
        ],
      },
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
      logger.info(" [ Trigger verify otp activation  Middleware ] ", {
        meta: 1,
      });
      next();
    } else throw new Error("Account not found");
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).send({
      msg: err.message || "Account not found",
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};
