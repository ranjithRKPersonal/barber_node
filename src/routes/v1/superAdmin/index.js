const { getConnection, connectAllDb } = require("../../../connectionManager");
const { STATUS } = require("../../../constants/statusConstants");
const { otpMailSender } = require("../../../service/mail/otpVerifyMail");
const tenantService = require("../../../service/tenant");

const getTenant = async (req, res) => {
    try {
    const dbConnection = req.dbConnection;
    console.log(dbConnection.name,"Tenant db name");
    let tenant = await tenantService.getTenant(dbConnection,req);
      if(tenant) {
       res.status(200).send({
      'msg' : 'Get tenant succssfully',
      'success' : STATUS.SUCCESS,
      'statusCode' : STATUS.POST_SUCCESS,
      'data' : tenant
      });
      }
     else {
        throw new Error("Tenant Not Exists")
     }
  }
    catch (err) {
      console.log("fetchAll error", err);
      res.status(err.statusCode || 500).send({
        'msg' : 'Get tenant Failed',
        'success' : STATUS.FAILED,
        'statusCode' : STATUS.GET_FAILED,
        'error' : err.message
     });
    }
  };
  
  const editTenant = async (req, res) => {
    try {
      const dbConnection = getConnection();
      const tenant = await tenantService.editTenant(dbConnection, req);
      res.status(200).send({
         'msg' : 'Tenant account edit succssfully',
         'success' : STATUS.SUCCESS,
         'statusCode' : STATUS.PATCH_SUCCESS,
         'data' : tenant
      });
    }
    catch (err) {
      console.log(" Tenant account edit error", err);
      res.status(err.statusCode || 500).send({
        'msg' :  err.message || 'Tenant account edit  failed',
        'success' : STATUS.FAILED,
        'statusCode' : STATUS.POST_FAILED,
        'error' : err.message
     });
    }
  };

  const fetchAllTenants = async (req, res) => {
    try {
      const dbConnection = getConnection();
      console.log("fetchAll dbConnection", dbConnection.name);
      const tenants = await tenantService.getAllTenants(dbConnection);
      res.status(200).json({ success: true, tenants });
      res.status(200).json().send({
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

  module.exports = {
    getTenant,editTenant,
    fetchAllTenants

  }