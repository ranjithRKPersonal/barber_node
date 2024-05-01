const { getConnection, connectAllDb } = require("../../../connectionManager");
const { STATUS } = require("../../../constants/statusConstants");
const registerVisitorService = require("../../../service/register/visitor");

const registerVisitor = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const visitor = await registerVisitorService.registerVisitor(
      dbConnection,
      req
    );
    if (visitor) {
      res.status(200).send({
        msg: "Visitor register succssfully",
        success: STATUS.SUCCESS,
        statusCode: STATUS.POST_SUCCESS,
        data: visitor,
      });
    } else {
      throw Error("Visitor registration failed");
    }
  } catch (err) {
    console.log("Visitor registration failed error", err);
    res.status(err.statusCode || 500).send({
      msg: err.message || "Visitor registration failed",
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const updateVisitorAssociateTenants = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const visitor = await registerVisitorService.updateVisitorAssociateTenants(
      dbConnection,
      req
    );
    if (visitor) {
      res.status(200).send({
        msg: "Visitor associate update succssfully",
        success: STATUS.SUCCESS,
        statusCode: STATUS.POST_SUCCESS,
        data: visitor,
      });
    } else {
      throw Error("Visitor  associate update  failed");
    }
  } catch (err) {
    console.log("Visitor  associate update  failed error", err);
    res.status(err.statusCode || 500).send({
      msg: err.message || "Visitor  associate update  failed",
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const loginVisitor = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const visitor = await registerVisitorService.loginVisitor(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: "Visitor login succssfully",
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: visitor,
    });
  } catch (err) {
    console.log("Visitor login error", err);
    res.status(err.statusCode || 500).send({
      msg: err.message,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const resetVisitorPassword = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const visitor = await registerVisitorService.resetVisitorPassword(
      dbConnection,
      req
    );
    if (visitor) {
      res.status(200).send({
        msg: "Visitor password reset succssfully",
        success: STATUS.SUCCESS,
        statusCode: STATUS.POST_SUCCESS,
        data: visitor,
      });
    } else {
      throw Error("Visitor password reset failed");
    }
  } catch (err) {
    console.log("Visitor password reset failed error", err);
    res.status(err.statusCode || 500).send({
      msg: err.message || "Visitor password reset failed",
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const visitorVisitList = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const visitorVisitList = await registerVisitorService.visitorVisitList(
      dbConnection,
      req
    );
    if (visitorVisitList) {
      res.status(200).send({
        msg: "Get visitor visit list succssfully",
        success: STATUS.SUCCESS,
        statusCode: STATUS.GET_SUCCESS,
        data: visitorVisitList,
      });
    } else {
      throw Error("Get visitor visit list failed");
    }
  } catch (err) {
    console.log("Get visitor visit list failed error", err);
    res.status(err.statusCode || 500).send({
      msg: err.message || "Get visitor visit list failed",
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const findClient = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const visitor = await registerVisitorService.findClient(dbConnection, req);
    if (visitor) {
      res.status(200).send({
        msg: "Get client succssfully",
        success: STATUS.SUCCESS,
        statusCode: STATUS.GET_SUCCESS,
        data: visitor,
      });
    } else {
      throw Error("Get client failed");
    }
  } catch (err) {
    console.log("Get client failed error", err);
    res.status(err.statusCode || 500).send({
      msg: err.message || "Get client  failed",
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
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
