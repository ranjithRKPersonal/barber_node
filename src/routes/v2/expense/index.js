const { getConnection, connectAllDb } = require('../../../connectionManager');
const { STATUS } = require('../../../constants/statusConstants');
const { responseMessages } = require('../../../constants/responseMessage');
const logger = require('../../../logger/index');
const expenseService = require('../../../service/expense/index');
const xlsx = require('xlsx');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


const createExpense = async (req, res) => {
  try {
    logger.info(' [ Trigger createExpense Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const expense = await expenseService.createExpense(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.CREATE_EXPENSE_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: expense,
    });
    logger.info(' [ Success createExpense ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed createExpense ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.CREATE_EXPENSE_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const editExpense = async (req, res) => {
  try {
    logger.info(' [ Trigger editExpense Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const expense = await expenseService.editExpense(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.EDIT_EXPENSE_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.PATCH_SUCCESS,
      data: expense,
    });
    logger.info(' [ Success editExpense ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed editExpense ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.EDIT_EXPENSE_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.PATCH_FAILED,
      error: err.message,
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    logger.info(' [ Trigger deleteExpense Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const expense = await expenseService.deleteExpense(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.DELETE_EXPENSE_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.DELETE_SUCCESS,
    });
    logger.info(' [ Success deleteExpense ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed deleteExpense ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.DELETE_EXPENSE_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.DELETE_FAILED,
      error: err.message,
    });
  }
};

const getSingleExpense = async (req, res) => {
  try {
    logger.info(' [ Trigger getSingleExpense Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const expense = await expenseService.getSingleExpense(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_EXPENSE_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: expense,
    });
    logger.info(' [ Success getSingleExpense ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed getSingleExpense ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_EXPENSE_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getAllExpense = async (req, res) => {
  try {
    logger.info(' [ Trigger getAllExpense Controller ] ', { meta: 1 });
    const dbConnection =  req.dbConnection;
    const expenses = await expenseService.getAllExpense(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_ALL_EXPENSE_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: expenses,
    });
    logger.info(' [ Success getAllExpense ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed getAllExpense ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_EXPENSE_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};



module.exports = {
  createExpense,
  editExpense,
  getAllExpense,
  getSingleExpense,
  deleteExpense
};
