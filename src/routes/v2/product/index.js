const { getConnection, connectAllDb } = require('../../../connectionManager');
const { STATUS } = require('../../../constants/statusConstants');
const { responseMessages } = require('../../../constants/responseMessage');
const logger = require('../../../logger/index');
const productService = require('../../../service/product/index');
const xlsx = require('xlsx');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


const createProduct = async (req, res) => {
  try {
    logger.info(' [ Trigger createProduct Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const expense = await productService.createProduct(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.CREATE_PRODUCT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: expense,
    });
    logger.info(' [ Success createProduct ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed createProduct ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.CREATE_PRODUCT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const editProduct = async (req, res) => {
  try {
    logger.info(' [ Trigger editExpense Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const expense = await productService.editProduct(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.EDIT_PRODUCT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.PATCH_SUCCESS,
      data: expense,
    });
    logger.info(' [ Success editExpense ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed editExpense ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.EDIT_PRODUCT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.PATCH_FAILED,
      error: err.message,
    });
  }
};

const deleteProduct= async (req, res) => {
  try {
    logger.info(' [ Trigger deleteExpense Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const expense = await productService.deleteProduct(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.DELETE_PRODUCT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.DELETE_SUCCESS,
    });
    logger.info(' [ Success deleteExpense ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed deleteExpense ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.DELETE_PRODUCT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.DELETE_FAILED,
      error: err.message,
    });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    logger.info(' [ Trigger getSingleExpense Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const expense = await productService.getSingleProduct(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_PRODUCT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: expense,
    });
    logger.info(' [ Success getSingleExpense ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed getSingleExpense ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_PRODUCT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    logger.info(' [ Trigger getAllExpense Controller ] ', { meta: 1 });
    const dbConnection =  req.dbConnection;
    const expenses = await productService.getAllProduct(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_ALL_PRODUCT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: expenses,
    });
    logger.info(' [ Success getAllExpense ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed getAllExpense ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_PRODUCT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};



module.exports = {
  createProduct,
  editProduct,
  getAllProduct,
  getSingleProduct,
  deleteProduct
};
