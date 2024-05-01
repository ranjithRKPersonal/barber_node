const { getConnection } = require('../../../connectionManager');
const { STATUS } = require('../../../constants/statusConstants');
const requestDemoService = require('../../../service/requestDemo/index');

const createRequestDemo = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const tenant = await requestDemoService.createRequestDemo(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: 'Your request received.We will call you within 24 hours',
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: tenant,
    });
  } catch (err) {
    console.log('Something you has error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

module.exports = {
  createRequestDemo,
};
