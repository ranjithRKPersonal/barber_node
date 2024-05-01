const { getConnection, connectAllDb } = require('../../../connectionManager');
const { STATUS } = require('../../../constants/statusConstants');
const {
  tenantRegisterSuccessMail,
} = require('../../../service/mail/accountMail');
const { otpMailSender } = require('../../../service/mail/otpVerifyMail');
const tenantService = require('../../../service/tenant');
const config = require('../../../config/env.json');

const verifyEmail = async (req, res) => {
  try {
    const dbConnection = getConnection();
    let otpData = await tenantService.verifyTenantEmail(dbConnection, req.body);
    if (otpData) {
      await otpMailSender(
        otpData.email,
        'ranjithnew22498@gmail.com',
        'Register Verification OTP',
        'otpVerifyRegister',
        otpData.otp
      ).then((data) => {
        res.status(200).send({
          msg: 'Otp sent succssfully',
          success: STATUS.SUCCESS,
          statusCode: STATUS.POST_SUCCESS,
          data: 'Please check your mail and verify otp',
        });
      });
    }
  } catch (err) {
    console.log('Otp create error error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message || 'Tenant register failed',
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const forgotPasswordVerifyEmail = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const otpData = await tenantService.verifyTenantEmail(
      dbConnection,
      req.body
    );
    if (otpData) {
      await otpMailSender(
        otpData.email,
        'ranjithnew22498@gmail.com',
        'Forgot Password Verification OTP',
        'otpVerifyForgotPassword',
        otpData.otp
      ).then((data) => {
        res.status(200).send({
          msg: 'Otp sent succssfully',
          success: STATUS.SUCCESS,
          statusCode: STATUS.POST_SUCCESS,
          data: 'Please check your mail and verify otp',
        });
      });
    }
  } catch (err) {
    console.log('Otp create error error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message || 'Tenant register failed',
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const verifyEmailOtp = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const otpData = await tenantService.verifyEmailOtp(dbConnection, req.body);
    if (otpData) {
      res.status(200).send({
        msg: 'Otp verified succssfully',
        success: STATUS.SUCCESS,
        statusCode: STATUS.POST_SUCCESS,
        data: otpData.expireIn,
      });
    } else {
      res.status(500).send({
        msg: 'Otp verified failed',
        success: STATUS.FAILED,
        statusCode: STATUS.FAILED,
        data: 'Something went wrong ...please try again',
      });
    }
  } catch (err) {
    console.log('Otp create error error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message || 'Otp verification failed',
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const register = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const tenant = await tenantService.registerTenant(dbConnection, req.body);
    res.status(200).send({
      msg: 'Tenant register succssfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: tenant,
      step: '1',
    });
  } catch (err) {
    console.log('signUp error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message || 'Tenant register failed',
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const create = async (req, res) => {
  try {
    const dbConnection = getConnection();
    var Test = await dbConnection.model('Tenant');
    const tenant = await tenantService.createTenantNew(dbConnection, req);
    connectAllDb();
    if (tenant) {
      console.log(tenant);
      var contentObj = {
        tenantName: tenant.businessName.split('_')[0],
        workspaceName: tenant.businessName,
        userEmail: tenant.email,
        verificationToken: `${config.LOCAL_CLIENT_URL}account-activation/${tenant.verificationToken.token}`,
      };
      await tenantRegisterSuccessMail(
        contentObj.userEmail,
        'ranjithnew22498@gmail.com',
        'Account Registration Completed',
        'tenantRegisterWelcome',
        contentObj
      ).then((data) => {
        res.status(200).send({
          msg: 'Tenant registered successfully',
          success: STATUS.SUCCESS,
          statusCode: STATUS.POST_SUCCESS,
          data: tenant,
          step: '2',
        });
      });
    } else {
      throw new Error('Tenant registered failed');
    }
  } catch (err) {
    console.log('signUp error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message || 'Tenant registered failed',
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const accountSetup = async (req, res) => {
  try {
    const dbConnection = req.dbConnection;
    const tenant = await tenantService.accountSetup(dbConnection, req);
    res.status(200).send({
      msg: 'Tenant account setup succssfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: tenant,
      step: '2',
    });
  } catch (err) {
    console.log('signUp error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message || 'Tenant account setup failed',
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const resendAccountVerificationLink = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const tenant = await tenantService.resendAccountVerificationLink(
      dbConnection,
      req
    );
    if (tenant) {
      console.log(tenant);
      var contentObj = {
        tenantName: tenant.businessName.split('_')[0],
        workspaceName: tenant.businessName,
        userEmail: tenant.email,
        verificationToken: `${config.LOCAL_CLIENT_URL}account-activation/${tenant.verificationToken.token}`,
      };
      await tenantRegisterSuccessMail(
        contentObj.userEmail,
        'ranjithnew22498@gmail.com',
        'Account Verification Resend Link',
        'tenantRegisterWelcome',
        contentObj
      ).then((data) => {
        res.status(200).send({
          msg: 'Account verification link resend succssfully',
          success: STATUS.SUCCESS,
          statusCode: STATUS.POST_SUCCESS,
          data: tenant,
        });
      });
    } else {
      throw new Error('Account verification link resend failed');
    }
  } catch (err) {
    console.log('Account verification link resend error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message || 'Account verification link resend failed',
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const getTenant = async (req, res) => {
  try {
    const dbConnection = req.dbConnection;
    console.log(dbConnection.name, 'Tenant db name');
    let tenant = await tenantService.getTenant(dbConnection, req);
    if (tenant) {
      res.status(200).send({
        msg: 'Get tenant succssfully',
        success: STATUS.SUCCESS,
        statusCode: STATUS.POST_SUCCESS,
        data: tenant,
      });
    } else {
      throw new Error('Tenant Not Exists');
    }
  } catch (err) {
    console.log('fetchAll error', err);
    res.status(err.statusCode || 500).send({
      msg: 'Get tenant Failed',
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getTenantIdByName = async (req, res) => {
  try {
    const dbConnection = getConnection();
    console.log(dbConnection.name, 'Tenant db name');
    let tenant = await tenantService.getTenantIdByName(dbConnection, req);
    if (tenant) {
      res.status(200).send({
        msg: 'Get tenant succssfully',
        success: STATUS.SUCCESS,
        statusCode: STATUS.POST_SUCCESS,
        data: tenant,
      });
    } else {
      throw new Error('Tenant Not Exists');
    }
  } catch (err) {
    console.log('fetchAll error', err);
    res.status(err.statusCode || 500).send({
      msg: 'Get tenant failed',
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const editTenant = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const tenant = await tenantService.editTenant(dbConnection, req);
    res.status(200).send({
      msg: 'Tenant account edit succssfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.PATCH_SUCCESS,
      data: tenant,
    });
  } catch (err) {
    console.log(' Tenant account edit error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message || 'Tenant account edit  failed',
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const updateTenantPlan = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const tenant = await tenantService.updateTenantPlan(dbConnection, req);
    res.status(200).send({
      msg: 'Tenant plan upgrade succssfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.PATCH_SUCCESS,
      data: tenant,
    });
  } catch (err) {
    console.log(' Tenant plan upgrade error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message || 'Tenant plan upgrade failed',
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const tenant = await tenantService.resetPassword(dbConnection, req.body);
    let payload = {
      _id: tenant._id,
      email: tenant.email,
    };
    res.status(200).send({
      msg: 'Password changed successfuly',
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: payload,
    });
  } catch (err) {
    console.log('Reset password error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message || 'Reset password failed',
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const loginTenant = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const tenant = await tenantService.loginTenant(dbConnection, req);
    res.status(200).send({
      msg: 'Tenant login succssfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: tenant,
    });
  } catch (err) {
    console.log('Login tenant error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const logoutTenant = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const tenant = await tenantService.logoutTenant(dbConnection, req);
    res.status(200).send({
      msg: 'Tenant logout succssfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: tenant,
    });
  } catch (err) {
    console.log('Login tenant error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const verifyTenantPassword = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const tenant = await tenantService.verifyTenantPassword(dbConnection, req);
    res.status(200).send({
      msg: 'Verify password succssfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: tenant,
    });
  } catch (err) {
    console.log('verifyTenantPassword error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const changeTenantPassword = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const tenant = await tenantService.changeTenantPassword(dbConnection, req);
    res.status(200).send({
      msg: 'Change password succssfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: tenant,
    });
  } catch (err) {
    console.log('Change password error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const getSocialLinks = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const socialLinks = await tenantService.getSocialLinks(dbConnection, req);
    res.status(200).send({
      msg: 'Get social links succssfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: socialLinks,
    });
  } catch (err) {
    console.log('getSocialLinks error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const updateSocialLinks = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const updateSocialLinks = await tenantService.updateSocialLinks(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: 'Update social links succssfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.PATCH_SUCCESS,
      data: updateSocialLinks,
    });
  } catch (err) {
    console.log(' updateSocialLinks  edit error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message || 'Update social links failed',
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const findWorkSpaceByTenantCode = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const tenant = await tenantService.findWorkSpaceByTenantCode(dbConnection, req);
    res.status(200).send({
      msg: 'Get Tenant Details succssfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: tenant,
    });
  } catch (err) {
    console.log('Get Tenant Details error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

module.exports = {
  create,
  loginTenant,
  register,
  verifyEmail,
  verifyEmailOtp,
  forgotPasswordVerifyEmail,
  resetPassword,
  editTenant,
  getTenant,
  verifyTenantPassword,
  changeTenantPassword,
  getSocialLinks,
  updateSocialLinks,
  logoutTenant,
  updateTenantPlan,
  accountSetup,
  resendAccountVerificationLink,
  getTenantIdByName,
  findWorkSpaceByTenantCode
};
