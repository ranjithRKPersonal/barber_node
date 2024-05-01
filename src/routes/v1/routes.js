const express = require('express');

// Mounting routes on api
const adminAuthApi = require('./admin/auth.js');
const adminApi = require('./admin/admin.js');
const entryApi = require('./entry/index');
const smsApi = require('./sms/index');
const requestDemoApi = require('./requestDemo/index');
const registerVisitorApi = require('./register/visitor');
const {
  requireEntryCheck,
  requireVisitorCheck,
} = require('../../middlewares/entry.js');
const requireClientCheckApi = require('./checker/client');
const requireTenantCheckApi = require('./checker/tenant');
const multer = require('multer');
const shortid = require('shortid');
const config = require('./../../config/env.json');
const server = require('./../../config/serverConfigs');

const jwt = require('jsonwebtoken');
const {
  adminMiddleware,
  tenantMiddleware,
  requireTenantSignin,
  requireAdminSignin,
  checkScanEntryKey,
  requireTokenVerify,
  requireVerifyClient,
  requireVerifyTenant,
  verifyAccountActivationLink,
  verifyOtpActivation,
} = require('../../middlewares/auth.js');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// connection resolver for tenant
const connectionResolver = require('../../middlewares/connectionResolver');
const { STATUS } = require('../../constants/statusConstants.js');
const { planTypes } = require('../../constants/planConstants.js');

//Routes initialize
const v1Routes = express.Router();

// common uploads
v1Routes.post(
  '/tenant/upload',
  requireTenantSignin,
  upload.array('image'),
  async (req, res) => {
    try {
      console.log('Image upload success');
      let fileNames = req.files.map((file) => {
        return { fileName: file.filename };
      });
      res.status(STATUS.POST_SUCCESS).send({
        msg: 'Image Upload Success',
        success: STATUS.SUCCESS,
        statusCode: STATUS.POST_SUCCESS,
        data: fileNames,
      });
    } catch (err) {
      console.log('Image upload failed');
      res.status(STATUS.POST_FAILED).send({
        msg: 'Image Upload Failed',
        success: STATUS.FAILED,
        statusCode: STATUS.POST_FAILED,
        error: err?.msg || 'Failed to upload image',
      });
    }
  }
);

//super admin login
v1Routes.post('/super/admin/login', async (req, res) => {
  try {
    if (
      // Development Server
      // req.body.email == config.DEV_SUPER_ADMIN_EMAIL &&
      // req.body.password == config.DEV_SUPER_ADMIN_PASSWORD
      // Live Server🚀  🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀
      req.body.email == server.super_admin_email &&
      req.body.password == server.super_admin_password
    ) {
      var token = jwt.sign(
        // Development Server
        // { role: "super admin", email: config.DEV_SUPER_ADMIN_EMAIL },

        // Live Server🚀  🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀
        { role: 'super admin', email: server.super_admin_email },

        config.SECRET_KEY,
        {
          expiresIn: '60d',
        }
      );
      res.status(200).send({
        msg: 'Super admin login sucessfully',
        success: STATUS.SUCCESS,
        statusCode: STATUS.POST_SUCCESS,
        data: token,
      });
    } else {
      throw new Error('Super admin access denied');
    }
  } catch (err) {
    console.log('Super admin access denied', err);
    res.status(200).send({
      msg: 'Super admin login failed',
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
    });
  }
});

//connection resolver
v1Routes.use('/tenant', connectionResolver.resolveTenant);
v1Routes.use('/admin', connectionResolver.setAdminDb);
v1Routes.use('/client', connectionResolver.setAdminDb);

// verify cleint
v1Routes.post(
  '/admin/tenant/client/verify',
  requireClientCheckApi.requireVerifyClient
);
// verify tenant
v1Routes.post(
  '/admin/tenant/verify',
  requireTenantCheckApi.requireVerifyTenant
);

//super admin login
v1Routes.post('/super/admin/login', async (req, res) => {
  try {
    if (
      // Development Server
      req.body.email == server.super_admin_email &&
      req.body.password == server.super_admin_password
      // Live Server 🚀  🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀
      // req.body.email == config.PROD_SUPER_ADMIN_EMAIL &&
      // req.body.password == config.PROD_SUPER_ADMIN_PASSWORD
    ) {
      res.status(200).send({
        msg: 'Super admin login sucessfully',
        success: STATUS.SUCCESS,
        statusCode: STATUS.POST_SUCCESS,
      });
    } else {
      throw new Error('Super admin access denied');
    }
  } catch (err) {
    console.log('Super admin access denied invalid');
    res.status(200).send({
      msg: 'Super admin login failed',
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
    });
  }
});

// admin
v1Routes.post('/admin/login', adminAuthApi.loginTenant);
v1Routes.post(
  '/admin/get/all/tenants',
  requireAdminSignin,
  adminAuthApi.logoutTenant
);
v1Routes.post(
  '/admin/super/update/tenant/plan',
  requireAdminSignin,
  adminAuthApi.updateTenantPlan
);
v1Routes.get('/admin/tenant/list', requireAdminSignin, adminApi.fetchAll);
v1Routes.post('/admin/tenant/create', requireAdminSignin, adminAuthApi.create);
v1Routes.post(
  '/admin/tenant/create/new',
  requireAdminSignin,
  adminAuthApi.create
);
v1Routes.get(
  '/admin/tenant/get',
  requireAdminSignin || requireTenantSignin,
  adminAuthApi.getTenant
);
v1Routes.patch(
  '/admin/tenant/edit',
  requireTenantSignin,
  adminAuthApi.editTenant
);
v1Routes.get(
  '/tenant/client/find',
  requireTenantSignin,
  registerVisitorApi.findClient
);
// tenant
v1Routes.post(
  '/admin/tenant/forgot/password',
  adminAuthApi.forgotPasswordVerifyEmail
);
v1Routes.post('/admin/tenant/reset/password', adminAuthApi.resetPassword);
v1Routes.post(
  '/admin/tenant/verify/activation/setup',
  verifyAccountActivationLink,
  verifyOtpActivation,
  adminAuthApi.accountSetup
);
v1Routes.post(
  '/admin/tenant/resend/activation/link',
  adminAuthApi.resendAccountVerificationLink
);
v1Routes.post('/admin/tenant/login', adminAuthApi.loginTenant);
v1Routes.post(
  '/admin/tenant/logout',
  requireTenantSignin,
  adminAuthApi.logoutTenant
);
v1Routes.post('/admin/tenant/verify/email/otp', adminAuthApi.verifyEmailOtp);
v1Routes.post(
  '/admin/tenant/verify/password',
  requireTenantSignin,
  adminAuthApi.verifyTenantPassword
);
v1Routes.post(
  '/admin/tenant/change/password',
  requireTenantSignin,
  adminAuthApi.changeTenantPassword
);
v1Routes.get(
  '/admin/tenant/social/links',
  requireTenantSignin,
  adminAuthApi.getSocialLinks
);

v1Routes.get(
  '/admin/tenants/get/name',
  requireVisitorCheck,
  adminAuthApi.getTenantIdByName
);

v1Routes.get('/admin/tenant/find/workspace/get', adminAuthApi.findWorkSpaceByTenantCode);
//entry
v1Routes.post('/tenant/create/entry', requireEntryCheck, entryApi.createEntry);
v1Routes.get(
  '/tenant/get/entry/all',
  requireTenantSignin,
  entryApi.getAllEntrys
);
v1Routes.get(
  '/tenant/filter/entry',
  requireTenantSignin,
  entryApi.filterAllEntrys
);
v1Routes.get(
  '/tenant/filter/entry/dashboard',
  requireTenantSignin,
  entryApi.filterAllEntrysDashboard
);
v1Routes.delete(
  '/tenant/entry/delete',
  requireTenantSignin,
  entryApi.deleteEntry
);
v1Routes.get(
  '/tenant/entry/get/single',
  requireTenantSignin,
  entryApi.getEntry
);
v1Routes.get(
  '/tenant/entry/get/all',
  requireTenantSignin,
  entryApi.getAllEntry
);
v1Routes.post('/tenant/edit/entry', requireTenantSignin, entryApi.editEntry);
v1Routes.delete(
  '/tenant/delete/entry',
  requireTenantSignin,
  entryApi.deleteEntry
);

// client request demo
v1Routes.post('/client/requestDemo/create', requestDemoApi.createRequestDemo);

// entry ids
v1Routes.post('/tenant/add/entry/key', entryApi.addEntryKey);

// register users
v1Routes.post('/admin/visitor/verify/email', adminAuthApi.verifyEmail);
v1Routes.post('/admin/visitor/register', registerVisitorApi.registerVisitor);
v1Routes.post(
  '/admin/update/visitor',
  registerVisitorApi.updateVisitorAssociateTenants
);
v1Routes.post('/admin/visitor/login', registerVisitorApi.loginVisitor);
v1Routes.post(
  '/admin/visitor/reset/password',
  registerVisitorApi.resetVisitorPassword
);

// sms
v1Routes.post('/admin/visitor/mobile/send/otp', smsApi.sendMobileOtp);
v1Routes.post('/admin/visitor/mobile/verify/otp', smsApi.verifyMobileOtp);
v1Routes.post(
  '/admin/visitor/forgot/mobile/verify/otp',
  smsApi.verifyMobileOtpForgot
);

// visitor
v1Routes.get(
  '/admin/visitor/visit/list',
  requireVisitorCheck,
  registerVisitorApi.visitorVisitList
);

// mock datas

v1Routes.get('/plan-list', async (req, res) => {
  try {
    let planList = planTypes;
    res.status(200).send({
      msg: 'Plan list get sucessfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: planList,
    });
  } catch (err) {
    res.status(200).send({
      msg: 'Plan list get login failed',
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
    });
  }
});
module.exports = v1Routes;
