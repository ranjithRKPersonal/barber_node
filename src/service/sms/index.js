const bcrypt = require("bcrypt");
const config = require("../../config/env.json");
const jwt = require("jsonwebtoken");
const { BaseUrl, SubUrl } = require("../../constants/statusConstants");
const axios = require('axios');

const generateJwtToken = async(payload) => {
  return jwt.sign({ payload }, config.SECRET_KEY, {
    expiresIn: "60d",
  });
};

const sendMobileOtp = async (req) => {
  try {
    const { mobile } = req.body;
    console.log("test",mobile);
    const url = `${BaseUrl.MSG_91}${SubUrl.SEND_OTP}?template_id=${config.MSG_91_SEND_OTP_TEMPLATE_ID}&mobile=${mobile}&authkey=${config.MSG_91_AUTH_KEY}`
    var reqDetail = {
        method: 'get',
        url: url
    }
    var otpResponse = await axios(reqDetail);
    console.log("otpResponse",otpResponse);
    if(otpResponse.data.type == 'success'){
      return otpResponse.data;
    }
    else {
      throw new Error(`${otpResponse.data.message}`);
    }
  } catch (error) {
    console.log("otp send error", error);
    throw error;
  }
};

const verifyMobileOtp = async (dbConnection,req) => {
  try {
    var Otp = dbConnection.model('Otp');
    const { otp,mobile } = req.body;
    const url = `${BaseUrl.MSG_91}${SubUrl.VERIFY_OTP}?authkey=${config.MSG_91_AUTH_KEY}&mobile=${mobile}&otp=${otp}`
    var reqDetail = {
        method: 'get',
        url: url
    }
    var otpResponse = await axios(reqDetail);
    if(otpResponse.data.type == 'success') {
      var otpData = {
        expireIn: new Date().getTime()+(5*60000),
        phoneNumber: mobile
      }
      var userPresent = await Otp.findOne({
        phoneNumber: mobile
      })
      if(!userPresent){
      var otpRequest = await new Otp(otpData);
      otpRequest.save();
      return otpRequest;
      }
      else {
        userPresent.expireIn = otpData.expireIn;
        userPresent.phoneNumber = otpData.phoneNumber;
        userPresent.save();
        return userPresent;
      }
    }
    else {
      throw new Error(`${otpResponse.data.message}`);
    }
  } catch (error) {
    console.log("otp send error", error);
    throw error;
  }
};

const verifyMobileOtpForgot = async (dbConnection,req) => {
  try {
    var Otp = dbConnection.model('Otp');
    const { otp,mobile } = req.body;
    const url = `${BaseUrl.MSG_91}${SubUrl.VERIFY_OTP}?authkey=${config.MSG_91_AUTH_KEY}&mobile=${mobile}&otp=${otp}`
    var reqDetail = {
        method: 'get',
        url: url
    }
    var otpResponse = await axios(reqDetail);
    if(otpResponse.data.type == 'success') {
      var otpData = {
        expireIn: new Date().getTime()+(3*60000),
        phoneNumber: mobile
      }
      var userPresent = await Otp.findOne({
        phoneNumber: mobile
      })
      if(!userPresent){
      var otpRequest = await new Otp(otpData);
      otpRequest.save();
      return otpRequest;
      }
      else {
        userPresent.expireIn = otpData.expireIn;
        userPresent.phoneNumber = otpData.phoneNumber;
        userPresent.save();
        return userPresent;
      }
    }
    else {
      throw new Error(`${otpResponse.data.message}`);
    }
  } catch (error) {
    console.log("otp send error", error);
    throw error;
  }
};

module.exports = {
    sendMobileOtp,verifyMobileOtp,
    verifyMobileOtpForgot
}