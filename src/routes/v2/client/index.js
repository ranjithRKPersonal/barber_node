const { getConnection, connectAllDb } = require('../../../connectionManager');
const { STATUS } = require('../../../constants/statusConstants');
const { responseMessages } = require('../../../constants/responseMessage');
const logger = require('../../../logger/index');
const clientService = require('../../../service/client/index');
const xlsx = require('xlsx');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


const createClient = async (req, res) => {
  try {
    logger.info(' [ Trigger createClient Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const category = await clientService.createClient(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.CREATE_CLIENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: category,
    });
    logger.info(' [ Success createClient ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed createClient ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.CREATE_CLIENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const editClient = async (req, res) => {
  try {
    logger.info(' [ Trigger editClient Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const client = await clientService.editClient(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.EDIT_CLIENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.PATCH_SUCCESS,
      data: client,
    });
    logger.info(' [ Success editClient ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed editClient ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.EDIT_CLIENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.PATCH_FAILED,
      error: err.message,
    });
  }
};

const deleteClient = async (req, res) => {
  try {
    logger.info(' [ Trigger deleteClient Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const client = await clientService.deleteClient(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.DELETE_CLIENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.DELETE_SUCCESS,
    });
    logger.info(' [ Success deleteClient ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed deleteClient ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.DELETE_CLIENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.DELETE_FAILED,
      error: err.message,
    });
  }
};

const getSingleClient = async (req, res) => {
  try {
    logger.info(' [ Trigger getSingleClient Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const service = await clientService.getSingleClient(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_CLIENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(' [ Success getSingleClient ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed getSingleClient ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_CLIENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getAllClient = async (req, res) => {
  try {
    logger.info(' [ Trigger getAllClient Controller ] ', { meta: 1 });
    const dbConnection =  req.dbConnection;
    const service = await clientService.getAllClient(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_ALL_CLIENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(' [ Success getAllClient ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed getAllService ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_CLIENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const registerClient = async (req, res) => {
  try {
    logger.info(' [ Trigger registerClient controller ] ', { meta: 1 });
    const dbConnection = getConnection();
    const category = await clientService.registerClient(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.CREATE_CLIENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: category,
    });
    logger.info(' [ Success registerClient ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed registerClient ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.CREATE_CLIENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};
const loginClient = async (req, res) => {
  try {
    logger.info(' [ Trigger loginClient Controller ] ', { meta: 1 });
    const dbConnection = getConnection();
    const category = await clientService.loginClient(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.LOGIN_CLIENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: category,
    });
    logger.info(' [ Success loginClient ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed loginClient ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.LOGIN_CLIENT__FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const getSingleTenantDetails = async (req, res) => {
  try {
    logger.info(' [ Trigger getTenantDetails Controller ] ', { meta: 1 });

    const dbConnection = getConnection();
    console.log(dbConnection.name, 'Tenant db name');

    let tenant = await clientService.getSingleTenantDetails(dbConnection, req);
    if (tenant) {
      res.status(200).send({
        msg: 'Get tenant successfully',
        success: STATUS.SUCCESS,
        statusCode: STATUS.POST_SUCCESS,
        data: tenant,
      });
      logger.info(' [ Success getTenantDetails ] ', { meta: 1 });
    } else {
      throw new Error('Tenant Not Exists');
    }
  } catch (err) {
    console.log('fetchAll error', err);
    logger.info(' [ Failed getTenantDetails ] ', { meta: 1 });

    res.status(err.statusCode || 500).send({
      msg: 'Get tenant failed',
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const bulkCreateClient = async (req, res) => {
  try {
    logger.info(' [ Trigger createClient service ] ');
    const dbConnection = req.dbConnection;
    let bulkUploadResponse = await clientService.bulkCreateClient(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.CREATE_CLIENT_BULK_UPLOAD_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: bulkUploadResponse,
    });

    logger.info(' [ Success bulkCreateClient ] ', { meta: 1 });
  }
  catch (err) {
    logger.error(' [ Failed bulkCreateClient ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.CREATE_CLIENT_BULK_UPLOAD_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
}


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
