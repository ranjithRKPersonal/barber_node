const { getConnection, connectAllDb } = require("../../../connectionManager");
const { STATUS } = require("../../../constants/statusConstants");
const { responseMessages } = require("../../../constants/responseMessage");
const logger = require("../../../logger/index");
const taxService = require("../../../service/tax/index");

const createTax = async (req, res) => {
  try {
    logger.info(" [ Trigger createTax Controller ] ", { meta: 1 });
    const dbConnection = getConnection();
    const category = await taxService.createTax(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.CREATE_TAX_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: category,
    });
    logger.info(" [ Success createTax ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed createTax ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.CREATE_TAX_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};


const getAllTax = async (req, res) => {
  try {
    logger.info(" [ Trigger getAllTax Controller ] ", { meta: 1 });
    const dbConnection = getConnection();
    const category = await taxService.getAllTax(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_ALL_TAX_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: category,
    });
    logger.info(" [ Success getAllTax ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed getAllTax ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_TAX_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const editTax = async (req, res) => {
    try {
      logger.info(" [ Trigger editTax Controller ] ", { meta: 1 });
      const dbConnection = getConnection();
      const category = await taxService.editTax(dbConnection, req);
      res.status(200).send({
        msg: responseMessages.EDIT_TAX_SUCCESS,
        success: STATUS.SUCCESS,
        statusCode: STATUS.GET_SUCCESS,
        data: category,
      });
      logger.info(" [ Success editTax ] ", { meta: 1 });
    } catch (err) {
      logger.error(" [ Failed editTax ] ", err.message);
      res.status(err.statusCode || 500).send({
        msg: responseMessages.EDIT_TAX_FAILED,
        success: STATUS.FAILED,
        statusCode: STATUS.GET_FAILED,
        error: err.message,
      });
    }
  };
const deleteTax = async (req, res) => {
    try {
      logger.info(" [ Trigger deleteTax Controller ] ", { meta: 1 });
      const dbConnection = getConnection();
      const category = await taxService.deleteTax(dbConnection, req);
      res.status(200).send({
        msg: responseMessages.DELETE_TAX_SUCCESS,
        success: STATUS.SUCCESS,
        statusCode: STATUS.GET_SUCCESS,
        data: category,
      });
      logger.info(" [ Success deleteTax ] ", { meta: 1 });
    } catch (err) {
      logger.error(" [ Failed deleteTax ] ", err.message);
      res.status(err.statusCode || 500).send({
        msg: responseMessages.DELETE_TAX_FAILED,
        success: STATUS.FAILED,
        statusCode: STATUS.GET_FAILED,
        error: err.message,
      });
    }
  };

const getTax = async (req, res) => {
    try {
      logger.info(" [ Trigger getTax Controller ] ", { meta: 1 });
      const dbConnection = getConnection();
      const category = await taxService.getSingleTax(dbConnection, req);
      res.status(200).send({
        msg: responseMessages.TAX_GET_SUCCESS,
        success: STATUS.SUCCESS,
        statusCode: STATUS.GET_SUCCESS,
        data: category,
      });
      logger.info(" [ Success getTax ] ", { meta: 1 });
    } catch (err) {
      logger.error(" [ Failed getTax ] ", err.message);
      res.status(err.statusCode || 500).send({
        msg: responseMessages.TAX_GET_FAILED,
        success: STATUS.FAILED,
        statusCode: STATUS.GET_FAILED,
        error: err.message,
      });
    }
};


module.exports = {
  createTax,
  getAllTax,
  editTax,
  getTax,
  deleteTax
};
