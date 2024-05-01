const { getConnection } = require("../../../connectionManager");
const { STATUS } = require("../../../constants/statusConstants");
const tenantService = require("../../../service/tenant");

const fetchAll = async (req, res) => {
  try {
    const dbConnection = getConnection();
    console.log("fetchAll dbConnection", dbConnection.name);
    const tenants = await tenantService.getAllTenants(dbConnection);
    res.status(200).send({
      'msg' : 'Get all tenants succssfully',
      'success' : STATUS.SUCCESS,
      'statusCode' : STATUS.GET_SUCCESS,
      'data' : tenants
   });
  }
  catch (err) {
    console.log("fetchAll error", err);
    res.status(err.statusCode || 500).send({
      'msg' : 'Get all tenants failed',
      'success' : STATUS.FAILED,
      'statusCode' : STATUS.GET_FAILED,
      'error' : err.message
   });
  }
};

module.exports = { fetchAll };
