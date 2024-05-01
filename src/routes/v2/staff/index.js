const { getConnection, getAdminConnection } = require('../../../connectionManager');
const { STATUS } = require('../../../constants/statusConstants');
const { responseMessages } = require('../../../constants/responseMessage');
const logger = require('../../../logger/index');
const staffService = require('../../../service/user/index');

const createUser = async (req, res) => {
  try {
    logger.info(' [ Trigger createUserController ] ', { meta: 1 });
    const dbConnection = getConnection();
    const user = await staffService.createUser(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.CREATE_USER_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: user,
    });
    logger.info(' [ Success createUser] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed createUser] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.CREATE_USER_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const getAllStaff = async (req, res) => {
  try {
    logger.info(' [ Trigger getAllStaff Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const service = await staffService.getAllStaff(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_ALL_CLIENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(' [ Success getAllStaff ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed getAllStaff ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_CLIENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const editStaff = async (req, res) => {
  try {
    logger.info(' [ Trigger editStaff Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const client = await staffService.editStaff(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.EDIT_STAFF_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.PATCH_SUCCESS,
      data: client,
    });
    logger.info(' [ Success editStaff ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed editStaff ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.EDIT_CLIENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.PATCH_FAILED,
      error: err.message,
    });
  }
};

const deactivateStaff = async (req, res) => {
  try {
    logger.info(' [ Trigger deactivateStaff Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const client = await staffService.deactivateStaff(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.EDIT_STAFF_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.PATCH_SUCCESS,
      data: client,
    });
    logger.info(' [ Success deactivateStaff ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed deactivateStaff ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.EDIT_CLIENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.PATCH_FAILED,
      error: err.message,
    });
  }
};

const getSingleStaff = async (req, res) => {
  try {
    logger.info(' [ Trigger getSingleStaff Controller ] ', { meta: 1 });
    const dbConnection = getConnection();
    const staff = await staffService.getSingleStaff(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_STAFF_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: staff,
    });
    logger.info(' [ Success getSingleStaff ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed getSingleStaff ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_STAFF_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const staffLogin = async (req, res) => {
  try {
    logger.info(' [ Trigger staffLogin Controller ] ', { meta: 1 });
    var dbConnection = getConnection();
    const response = await staffService.staffLogin(dbConnection, req);
    // req.headers.tenant = 'Admins';
    dbConnection = getAdminConnection();
    const responseData = await staffService.staffLoginWithAdminData(dbConnection, req,response);
    res.status(200).send({
      msg: responseMessages.LOGIN_CLIENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: responseData,
    });
    logger.info(' [ Success staffLogin ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed staffLogin ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.LOGIN_CLIENT__FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

module.exports = {
  createUser,
  getAllStaff,
  editStaff,
  getSingleStaff,
  staffLogin,
  deactivateStaff
};
