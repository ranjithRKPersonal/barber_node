const { getConnection, connectAllDb } = require("../../../connectionManager");
const { STATUS } = require("../../../constants/statusConstants");
const { responseMessages } = require("../../../constants/responseMessage");
const logger = require("../../../logger/index");
const campaignService = require("../../../service/campaign/index");

const createCampaign = async (req, res) => {
  try {
    logger.info(" [ Trigger createCampaign Controller ] ", { meta: 1 });
    const dbConnection = getConnection();
    const campaign = await campaignService.createCampaign(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.CREATE_CAMPAIGN_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: campaign
    });
    logger.info(" [ Success createCampaign ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed createCampaign ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.CREATE_CAMPAIGN_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const editCampaign = async (req, res) => {
  try {
    logger.info(" [ Trigger editCampaign Controller ] ", { meta: 1 });
    const dbConnection = getConnection();
    const campaign = await campaignService.editCampaign(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.EDIT_CAMPAIGN_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.PATCH_SUCCESS,
      date: campaign,
    });
    logger.info(" [ Success editCampaign ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed editCampaign ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.EDIT_CAMPAIGN_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.PATCH_FAILED,
      error: err.message,
    });
  }
};


const getSingleCampaign = async (req, res) => {
  try {
    logger.info(" [ Trigger getSingleCampaign Controller ] ", { meta: 1 });
    const dbConnection = getConnection();
    const campaign = await campaignService.getSingleCampaign(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_CAMPAIGN_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: campaign,
    });
    logger.info(" [ Success getSingleCampaign ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed getSingleCampaign ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_CAMPAIGN_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getAllCampaign = async (req, res) => {
  try {
    logger.info(" [ Trigger getAllCampaign Controller ] ", { meta: 1 });
    const dbConnection = getConnection();
    const campaign = await campaignService.getAllCampaign(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_ALL_CAMPAIGN_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: campaign,
    });
    logger.info(" [ Success getAllCampaign ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed getAllCampaign ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL__CAMPAIGN_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};



module.exports = {
  createCampaign,
  editCampaign,
  getSingleCampaign,
  getAllCampaign
};
