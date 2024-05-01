const { getConnection } = require('../../../connectionManager');
const { STATUS } = require('../../../constants/statusConstants');
const { responseMessages } = require('../../../constants/responseMessage');
const logger = require('../../../logger/index');
const featureMapService = require('../../../service/featureMap/index');


const getAllFeatureMapping = async (req, res) => {
  try {
    logger.info(' [ Trigger getSingleStaff Controller ] ', { meta: 1 });
    const dbConnection = getConnection();
    const featureList = await featureMapService.getAllFeatureMapping(dbConnection,req);
    res.status(200).send({
      msg: responseMessages.GET_STAFF_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: featureList,
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

module.exports = {
 getAllFeatureMapping
};
