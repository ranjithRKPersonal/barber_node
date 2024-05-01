const STATUS = {
    GET_SUCCESS : 200,
    GET_FAILED : 400,
    POST_SUCCESS : 201,
    POST_FAILED : 401,
    PATCH_SUCCESS : 202,
    PATCH_FAILED : 402,
    DELETE_SUCCESS : 203,
    DELETE_FAILED : 403,
    SUCCESS : true,
    FAILED : false
 }

 const BaseUrl = {
     MSG_91: 'https://api.msg91.com'
 }

 const SubUrl = {
     SEND_OTP: '/api/v5/otp',
     VERIFY_OTP: '/api/v5/otp/verify',
     SEND_SINGLE_SMS: '/api/v5/flow/'
 }

 module.exports = { STATUS,BaseUrl,SubUrl }