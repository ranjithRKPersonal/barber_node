const { STATUS } = require('../../../constants/statusConstants');
const { responseMessages } = require('../../../constants/responseMessage');
const logger = require('../../../logger/index');
const draftService = require('../../../service/draft/index');
const { getConnection } = require("../../../connectionManager");

const createDraft = async (req, res) => {
  try {
    logger.info(' [ Trigger createDraft Controller ] ', { meta: 1 });
    const dbConnection = getConnection();
    const draft = await draftService.createDraft(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.CREATE_DRAFT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: draft,
    });
    logger.info(' [ Success createDraft ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed createDraft ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.CREATE_DRAFT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const editDraft = async (req, res) => {
  try {
    logger.info(' [ Trigger editDraft Controller ] ', { meta: 1 });
    const dbConnection = getConnection();
    const draft = await draftService.editDraft(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.EDIT_DRAFT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.PATCH_SUCCESS,
      data: draft,
    });
    logger.info(' [ Success editDraft ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed editDraft ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.EDIT_DRAFT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.PATCH_FAILED,
      error: err.message,
    });
  }
};

const deleteDraft = async (req, res) => {
  try {
    logger.info(' [ Trigger deleteDraft Controller ] ', { meta: 1 });
    const dbConnection = getConnection();
    const category = await draftService.deleteDraft(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.DELETE_DRAFT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.DELETE_SUCCESS,
    });
    logger.info(' [ Success deleteDraft ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed deleteDraft ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.DELETE_DRAFT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.DELETE_FAILED,
      error: err.message,
    });
  }
};

const getDraft = async (req, res) => {
  try {
    logger.info(' [ Trigger getDraft Controller ] ', { meta: 1 });
    const dbConnection = getConnection();
    const service = await draftService.getDraft(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_DRAFT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(' [ Success getDraft ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed getDraft ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_DRAFT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getAllDraft = async (req, res) => {
  try {
    logger.info(' [ Trigger getAllDraft Controller ] ', { meta: 1 });
    const dbConnection = getConnection();
    const service = await draftService.getAllDraft(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.GET_ALL_DRAFT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(' [ Success getAllDraft ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed getAllDraft ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_DRAFT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};


module.exports = {
  createDraft,
  editDraft,
  deleteDraft,
  getDraft,
  getAllDraft,
};
