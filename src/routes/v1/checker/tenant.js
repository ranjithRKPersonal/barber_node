const jwt = require("jsonwebtoken");
const { getConnection } = require("../../../connectionManager");
const { STATUS } = require("../../../constants/statusConstants");
const { validatePlan } = require("../../../service/tenant");
const config = require("../../../config/env.json");


const requireVerifyTenant = async (req, res, next) => {
    try {
       console.log("Trigger verify admin");
       if (req.headers.authorization) {
         var dbConnection = getConnection();
         const token = req.headers.authorization.split(" ")[1];
         const user = jwt.verify(token, config.SECRET_KEY);
         const Tenant = await dbConnection.model("Tenant");
         const tenantPresent = await Tenant.findOne({ dbName: req.headers.tenant});
         if(tenantPresent){
            var check = await validatePlan(tenantPresent.planType,tenantPresent.planActivatedDate);
            if(!check.valid) {
                throw new Error("Tenant plan expired");
            }
            var sessionChecker = true;
            if(req.body.role = 'Staff') {
               sessionChecker = true;
            }else{
            var sessionList  = tenantPresent.activeSessions;
            sessionChecker= sessionList.some((session) => {
                if(session._id == req.body.sessionId) {
                    return true;
                }
            })}
            if(!sessionChecker) {
               throw new Error("Session expired please signin");
            }
         }
         
         if(user) {
           req.user = user;
           return res.status(200).send({
             'msg' : 'Token Valid ',
             'success' : STATUS.SUCCESS,
             'statusCode' : STATUS.POST_SUCCESS,
             'data':{ validToken:true }
          });
         }
         else {
            throw new Error("Token Invalid");
         }
        }
        else {
          throw new Error("Token is required");
       }
       }
      catch(err) {
         console.log(err);
         return res.status(err.statusCode || 500).send({
          'msg' : 'Access denied token invalid',
          'success' : STATUS.FAILED,
          'statusCode' : STATUS.POST_FAILED,
          'error' : err.message
       });
    }
 };

 module.exports = {
    requireVerifyTenant
 }