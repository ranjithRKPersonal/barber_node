const { STATUS } = require("../constants/statusConstants");
const config = require("../config/env.json");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const { checkScanEntryKey } = require("./auth");

exports.requireEntryCheck = async (req, res, next) => {
    try {
       console.log("Trigger EntryCheck Middleware");
       if (req.headers.authorization) {
         const token = req.headers.authorization.split(" ")[1];
         const user = jwt.verify(token, config.SECRET_KEY);
         if(user) {
            var userData = jwtDecode(token);
            req.userData = userData;
            if(req.userData.payload.role && req.userData.payload.role == "Client") {
              console.log("checkScanEntryKey");
              var checkEntryKey = await checkScanEntryKey(req,res,next);
              if(checkEntryKey) next();
              else throw new Error("Entry key access denied");
            }
            else {
               next();
            }
         }
         else {
            throw new Error("User access denied")
         }
        }
        else {
            throw new Error("User access denied")
        }
       }
      catch(err) {
         console.log(err);
         return res.status(err.statusCode || 500).send({
          'msg' : 'User access denied',
          'success' : STATUS.FAILED,
          'statusCode' : STATUS.POST_FAILED,
          'error' : err.message
       });
    }
 };



 exports.requireVisitorCheck = async (req, res, next) => {
   try {
      console.log("Trigger EntryCheck Middleware");
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, config.SECRET_KEY);
        if(user) {
           var userData = jwtDecode(token);
           req.userData = userData;
            next();
        }
        else {
           throw new Error("User access denied")
        }
       }
       else {
           throw new Error("User access denied")
       }
      }
     catch(err) {
        console.log(err);
        return res.status(err.statusCode || 500).send({
         'msg' : 'User access denied',
         'success' : STATUS.FAILED,
         'statusCode' : STATUS.POST_FAILED,
         'error' : err.message
      });
   }
};