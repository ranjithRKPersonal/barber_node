const { getConnection, connectAllDb } = require("../../../connectionManager");
const { STATUS } = require("../../../constants/statusConstants");
const smsService = require("../../../service/sms/index");


const sendMobileOtp = async (req, res) => {
    try {
        const userOtp = await smsService.sendMobileOtp(req);
         if(userOtp){
         res.status(200).send({
           'msg' : 'Otp added succssfully',
           'success' : STATUS.SUCCESS,
           'statusCode' : STATUS.POST_SUCCESS,
           'data':'Please check your mobile  and verify otp'
        });
      }
      else {
        throw new Error("Failed to send otp");
      }
   }
   catch (err) {
     console.log("Otp create error error", err);
     res.status(err.statusCode || 500).send({
       'msg' : err.message|| 'Failed to send otp',
       'success' : STATUS.FAILED,
       'statusCode' : STATUS.POST_FAILED,
       'error' : err.message
    });
   }
 };

 const verifyMobileOtp = async (req, res) => {
  try {
      const dbConnection = getConnection();
      const verifyOtp = await smsService.verifyMobileOtp(dbConnection,req);
      if(verifyOtp) {
        const Visitor = await dbConnection.model("Visitor");
        var visitorData = await Visitor.findOne({
          phoneNumber: req.body.phoneNumber
        });
        if(!visitorData) {
          var newVisitor = await new Visitor({
            phoneNumber: req.body.phoneNumber,
            countryCode: req.body.countryCode,
            accountVerified: false
          });
          newVisitor.save();
        }
        res.status(200).send({
          'msg' : 'Otp verified successfully',
          'success' : STATUS.SUCCESS,
          'statusCode' : STATUS.POST_SUCCESS,
          'data':verifyOtp.expireIn
        });
     }
     else {
       throw new Error("Failed to verify otp");
     }
 }
 catch (err) {
   console.log("Otp verify error", err);
   res.status(err.statusCode || 500).send({
     'msg' : err.message|| 'Failed to verify otp',
     'success' : STATUS.FAILED,
     'statusCode' : STATUS.POST_FAILED,
     'error' : err.message
  });
 }
};

const verifyMobileOtpForgot = async (req, res) => {
  try {
      const dbConnection = getConnection();
      const verifyOtp = await smsService.verifyMobileOtpForgot(dbConnection,req);
      if(verifyOtp) {
        const Visitor = await dbConnection.model("Visitor");
        var visitorData = await Visitor.findOne({
          phoneNumber: req.body.phoneNumber 
        });
        if(!visitorData) {
          var newVisitor = await new Visitor({
            phoneNumber: req.body.phoneNumber,
            accountVerified: false
          });
          newVisitor.save();
        }
        res.status(200).send({
          'msg' : 'Otp verified successfully',
          'success' : STATUS.SUCCESS,
          'statusCode' : STATUS.POST_SUCCESS,
          'data': verifyOtp.expireIn
        });
     }
     else {
       throw new Error("Failed to verify otp");
     }
 }
 catch (err) {
   console.log("Otp verify error", err);
   res.status(err.statusCode || 500).send({
     'msg' : err.message|| 'Failed to verify otp',
     'success' : STATUS.FAILED,
     'statusCode' : STATUS.POST_FAILED,
     'error' : err.message
  });
 }
};

 module.exports = { 
   sendMobileOtp,verifyMobileOtp,
   verifyMobileOtpForgot
   };