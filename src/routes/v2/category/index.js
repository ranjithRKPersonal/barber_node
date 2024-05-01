const { getConnection, connectAllDb } = require("../../../connectionManager");
const { STATUS } = require("../../../constants/statusConstants");
const { responseMessages } = require("../../../constants/responseMessage");
const logger = require("../../../logger/index");
const categoryService = require("../../../service/category/index");

const createCategory = async (req, res) => {
  try {
    logger.info(" [ Trigger createCategory Controller ] ", { meta: 1 });
    const dbConnection = req.dbConnection;
    const category = await categoryService.createCategory(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.CREATE_CATEGORY_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      date: category,
    });
    logger.info(" [ Success createCategory ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed createCategory ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.CREATE_CATEGORY_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const editCategory = async (req, res) => {
  try {
    logger.info(" [ Trigger editCategory Controller ] ", { meta: 1 });
    const dbConnection = req.dbConnection;
    const category = await categoryService.editCategory(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.EDIT_CATEGORY_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.PATCH_SUCCESS,
      date: category,
    });
    logger.info(" [ Success editCategory ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed editCategory ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.EDIT_CATEGORY_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.PATCH_FAILED,
      error: err.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    logger.info(" [ Trigger deleteCategory Controller ] ", { meta: 1 });
    const dbConnection = req.dbConnection;
    const category = await categoryService.deleteCategory(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.DELETE_CATEGORY_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.DELETE_SUCCESS,
    });
    logger.info(" [ Success deleteCategory ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed deleteCategory ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.DELETE_CATEGORY_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.DELETE_FAILED,
      error: err.message,
    });
  }
};

const getSingleCategory = async (req, res) => {
  try {
    logger.info(" [ Trigger getSingleCategory Controller ] ", { meta: 1 });
    const dbConnection = getConnection();
    const category = await categoryService.getSingleCategory(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_CATEGORY_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: category,
    });
    logger.info(" [ Success getSingleCategory ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed getSingleCategory ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_CATEGORY_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    logger.info(" [ Trigger getAllCategory Controller ] ", { meta: 1 });
    const dbConnection = getConnection();
    const category = await categoryService.getAllCategory(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_ALL_CATEGORY_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: category,
    });
    logger.info(" [ Success getAllCategory ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed getAllCategory ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_CATEGORY_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getAllUsedCategory = async (req, res) => {
  try {
    logger.info(" [ Trigger getAllUsedCategory Controller ] ", { meta: 1 });
    const dbConnection = getConnection();
    const category = await categoryService.getAllUsedCategory(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_ALL_CATEGORY_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: category,
    });
    logger.info(" [ Success getAllUsedCategory ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed getAllUsedCategory ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_CATEGORY_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};


module.exports = {
  createCategory,
  editCategory,
  deleteCategory,
  getSingleCategory,
  getAllCategory,
  getAllUsedCategory
};
