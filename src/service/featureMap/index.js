const logger = require('../../logger/index');

const getAllFeatureMapping = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllFeatureMapping service ] ');
    const FeatureMap = await dbConnection.model('FeatureMap');
    const featureListFound = await FeatureMap.find({});
   
    if (featureListFound) return featureListFound;
    else [];
  } catch (error) {
    logger.error(' [ Failed getAllFeatureMapping service ] ', error.message);
    throw new Error(error.message);
  }
};

module.exports = {
    getAllFeatureMapping
};
