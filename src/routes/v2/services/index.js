const { getConnection, connectAllDb } = require("../../../connectionManager");
const { STATUS } = require("../../../constants/statusConstants");
const { responseMessages } = require("../../../constants/responseMessage");
const logger = require("../../../logger/index");
const myServicesService = require("../../../service/services/index");

const createService = async (req, res) => {
  try {
    logger.info(" [ Trigger createService Controller ] ", { meta: 1 });
    const dbConnection = req.dbConnection;
    const category = await myServicesService.createService(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.CREATE_SERVICE_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      date: category,
    });
    logger.info(" [ Success createCategory ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed createCategory ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.CREATE_SERVICE_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const editService = async (req, res) => {
  try {
    logger.info(" [ Trigger editService Controller ] ", { meta: 1 });
    const dbConnection = req.dbConnection;
    const service = await myServicesService.editService(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.EDIT_SERVICE_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.PATCH_SUCCESS,
      date: service,
    });
    logger.info(" [ Success editService ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed editService ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.EDIT_SERVICE_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.PATCH_FAILED,
      error: err.message,
    });
  }
};

const deleteService = async (req, res) => {
  try {
    logger.info(" [ Trigger deleteService Controller ] ", { meta: 1 });
    const dbConnection = req.dbConnection;
    const category = await myServicesService.deleteService(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.DELETE_SERVICE_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.DELETE_SUCCESS,
    });
    logger.info(" [ Success deleteService ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed deleteService ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.DELETE_SERVICE_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.DELETE_FAILED,
      error: err.message,
    });
  }
};

const getSingleService = async (req, res) => {
  try {
    logger.info(" [ Trigger getSingleService Controller ] ", { meta: 1 });
    const dbConnection = getConnection();
    const service = await myServicesService.getSingleService(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_SERVICE_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(" [ Success getSingleService ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed getSingleService ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_SERVICE_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getAllService = async (req, res) => {
  try {
    logger.info(" [ Trigger getAllService Controller ] ", { meta: 1 });
    const dbConnection = getConnection();
    const service = await myServicesService.getAllService(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_ALL_SERVICE_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(" [ Success getAllService ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed getAllService ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_SERVICE_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getServiceListByCategory = async (req, res) => {
  try {
    logger.info(" [ Trigger getServiceListByCategory Controller ] ", {
      meta: 1,
    });
    const dbConnection = getConnection();
    const service = await myServicesService.getServiceListByCategory(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.GET_ALL_SERVICE_BY_CATEGORY_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(" [ Success getServiceListByCategory ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed getServiceListByCategory ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_SERVICE_BY_CATEGORY_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

module.exports = {
  createService,
  editService,
  deleteService,
  getSingleService,
  getAllService,
  getServiceListByCategory,
};
