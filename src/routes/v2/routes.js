const express = require('express');

// Mounting routes on api
const categoryApi = require('./category/index');
const serviceApi = require('./services/index');
const clientApi = require('./client/index');
const appointmentApi = require('./appointment/index');
const invoiceApi = require('./invoice/index');
const staffApi = require('./staff/index');
const taxApi = require('./tax/index');
const campaignApi = require('./campaign/index');
const featureMapApi = require('./featureMap/index');
const draftApi = require('./draft/index');
const multer = require('multer');
const xlsx = require('xlsx');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const csv = require('csv-parser');
const expenseApi = require('./expense/index');

// mounting routes on api
const {
  requireTenantSignin,
  requireClientSignin,
  requireTenantConnection,
} = require('../../middlewares/auth');

// utils
const connectionResolver = require('../../middlewares/connectionResolver');
const { STATUS } = require('../../constants/statusConstants.js');
const { genderTypes } = require('../../constants/gender.js');
const {
  appointmentStatusTypes,
} = require('../../constants/appointmentStatus.js');
const {
  tenantServiceDurationTypes,
} = require('../../constants/serviceSlots.js');
const {
  tenantServiceTimeTypes,
} = require('../../constants/serviceSlotTime.js');

// validators

const {
  validateCategorySchema,
  validateCategoryRequest,
} = require('../../validators/category');
const {
  validateServiceSchema,
  validateServiceRequest,
} = require('../../validators/service');
const { validateClientSchema } = require('../../validators/client');
const {
  validateAppointmentSchema,
  validateAppointmentRequest,
} = require('../../validators/appointment');
const { paymentTypes } = require('../../constants/paymentTypes');
const { getConnectionByTenant } = require('../../connectionManager');

// routes initialize

const v2Routes = express.Router();

// connection resolvers

v2Routes.use('/tenant', connectionResolver.resolveTenant);
v2Routes.use('/admin', connectionResolver.setAdminDb);
v2Routes.use('/client', connectionResolver.setAdminDb);

// category

v2Routes.post(
  '/tenant/category/create',
  requireTenantSignin,
  validateCategorySchema,
  validateCategoryRequest,
  categoryApi.createCategory
);
v2Routes.patch(
  '/tenant/category/edit',
  requireTenantSignin,
  validateCategorySchema,
  validateCategoryRequest,
  categoryApi.editCategory
);
v2Routes.get('/tenant/category/get', categoryApi.getSingleCategory);
v2Routes.delete(
  '/tenant/category/delete',
  requireTenantSignin,
  categoryApi.deleteCategory
);
v2Routes.get('/tenant/category/getAll', categoryApi.getAllCategory);
v2Routes.get('/tenant/used/category/getAll', categoryApi.getAllUsedCategory);

// service

v2Routes.post(
  '/tenant/service/create',
  requireTenantSignin,
  validateServiceSchema,
  validateServiceRequest,
  serviceApi.createService
);
v2Routes.patch(
  '/tenant/service/edit',
  requireTenantSignin,
  validateServiceSchema,
  validateServiceRequest,
  serviceApi.editService
);
v2Routes.get('/tenant/service/get', serviceApi.getSingleService);
v2Routes.get('/tenant/service/getAll', serviceApi.getAllService);
v2Routes.delete(
  '/tenant/service/delete',
  requireTenantSignin,
  serviceApi.deleteService
);
v2Routes.get('/tenant/service/list', serviceApi.getServiceListByCategory);

// client

v2Routes.post(
  '/tenant/client/create',
  requireTenantSignin,
  validateClientSchema,
  validateServiceRequest,
  clientApi.createClient
);
v2Routes.patch(
  '/tenant/client/edit',
  requireTenantSignin,
  validateClientSchema,
  validateServiceRequest,
  clientApi.editClient
);
v2Routes.get(
  '/tenant/client/get',
  requireTenantSignin,
  clientApi.getSingleClient
);
v2Routes.get(
  '/tenant/client/getAll',
  requireTenantSignin,
  clientApi.getAllClient
);
v2Routes.delete(
  '/tenant/client/delete',
  requireTenantSignin,
  clientApi.deleteClient
);
v2Routes.post('/tenant/client/register', clientApi.registerClient);
v2Routes.post('/tenant/client/login', clientApi.loginClient);
v2Routes.post('/tenant/staff/login', staffApi.staffLogin);
v2Routes.get(
  '/admin/get/organization/details',
  clientApi.getSingleTenantDetails
);

// appointment

v2Routes.post(
  '/tenant/appointment/create',
  requireTenantSignin || requireClientSignin,
  validateAppointmentSchema,
  validateAppointmentRequest,
  appointmentApi.createAppointment
);

v2Routes.get(
  '/tenant/appointment/get',
  requireTenantSignin || requireClientSignin,
  appointmentApi.getAppointment
);

v2Routes.patch(
  '/tenant/appointment/edit',
  requireTenantSignin || requireClientSignin,
  validateAppointmentSchema,
  validateAppointmentRequest,
  appointmentApi.editAppointment
);

v2Routes.get(
  '/tenant/appointment/getAll',
  requireTenantSignin || requireClientSignin,
  appointmentApi.getAllAppointment
);

v2Routes.get(
  '/tenant/appointment/list',
  requireTenantSignin || requireClientSignin,
  appointmentApi.getAllAppointmentList
);

v2Routes.get(
  '/tenant/appointment/filter',
  requireTenantSignin || requireClientSignin,
  appointmentApi.getFilterAppointment
);

v2Routes.get(
  '/tenant/appointment/filter/dashboard',
  requireTenantSignin || requireClientSignin,
  appointmentApi.getDashboardAppointmentList
);
v2Routes.get(
  '/tenant/appointment/getSingleClientAllAppointment',
  requireClientSignin,
  appointmentApi.getSingleClientAllAppointment
);
v2Routes.get(
  '/tenant/appointment/getAllAppointmentWithRelationShip',
  requireTenantSignin,
  appointmentApi.getAllAppointmentWithRelationShip
);

v2Routes.patch(
  '/tenant/appointment/status/update',
  requireTenantSignin,
  appointmentApi.updateAppointmentStatus
);

v2Routes.post(
  '/tenant/invoice/create',
  requireTenantSignin,
  invoiceApi.createInvoice
);

// Staff

v2Routes.post('/tenant/user/create', requireTenantSignin, staffApi.createUser);
v2Routes.get('/tenant/staff/getAll', requireTenantSignin, staffApi.getAllStaff);
v2Routes.patch('/tenant/staff/edit', requireTenantSignin, staffApi.editStaff);
v2Routes.get('/tenant/staff/get', requireTenantSignin, staffApi.getSingleStaff);
v2Routes.patch('/tenant/staff/deactivate', requireTenantSignin, staffApi.deactivateStaff);

v2Routes.get(
  '/tenant/invoice/get',
  requireTenantConnection,
  invoiceApi.getInvoice
);

v2Routes.get(
  '/tenant/invoice/getAll',
  requireTenantSignin,
  invoiceApi.getAllInvoice
);

v2Routes.patch(
  '/tenant/invoice/edit',
  requireTenantSignin,
  invoiceApi.editInvoice
);

v2Routes.get(
  '/tenant/invoice/filter/dashboard',
  requireTenantSignin,
  invoiceApi.getDashboardInvoiceList
);

// tax

v2Routes.post(
  '/tenant/tax/create',
  // requireTenantSignin,
  taxApi.createTax)
  
  v2Routes.get(
    '/tenant/tax/getAll',
    // requireTenantSignin,
    taxApi.getAllTax)
  
  v2Routes.get(
    '/tenant/tax/get',
    // requireTenantSignin,
    taxApi.getTax)
    
  v2Routes.patch(
    '/tenant/tax/update',
    // requireTenantSignin,
    taxApi.editTax)
  
  v2Routes.patch(
      '/tenant/tax/delete',
      // requireTenantSignin,
    taxApi.deleteTax)
// Campaign

v2Routes.post('/tenant/campaign/create', campaignApi.createCampaign);
v2Routes.patch('/tenant/campaign/edit', campaignApi.editCampaign);
v2Routes.get('/tenant/campaign/get', campaignApi.getSingleCampaign);
v2Routes.get('/tenant/campaign/getAll', campaignApi.getAllCampaign);

// Feature Mapping

v2Routes.get('/tenant/feature-map/list', featureMapApi.getAllFeatureMapping);

// Draft 

v2Routes.post('/tenant/draft/create', draftApi.createDraft);
v2Routes.get('/tenant/draft/getAll', draftApi.getAllDraft);
v2Routes.patch('/tenant/draft/edit', draftApi.editDraft);
v2Routes.get('/tenant/draft/get', draftApi.getDraft);
v2Routes.delete('/tenant/draft/delete', draftApi.deleteDraft);

// Expense 

v2Routes.post('/tenant/expense/create',requireTenantSignin, expenseApi.createExpense );
v2Routes.patch('/tenant/expense/edit',requireTenantSignin,expenseApi.editExpense);
v2Routes.get('/tenant/expense/get', requireTenantSignin,expenseApi.getSingleExpense);
v2Routes.get('/tenant/expense/getAll',requireTenantSignin, expenseApi.getAllExpense);
v2Routes.delete('/tenant/expense/delete',requireTenantSignin,expenseApi.deleteExpense);

// Today view filter
v2Routes.get(
  '/tenant/overview/getAll',
  appointmentApi.getAllOverviewList
);

v2Routes.get(
  '/tenant/dashboard/overview',
  appointmentApi.getDashBoardOverviewList
);

v2Routes.post('/tenant/client/upload/bulk/excel/create',
  requireTenantConnection,
  upload.single('file'), (req, res, next) => {
    var clients = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        console.log("___TEST__",data.phoneNumber);
        if (data.phoneNumber == '' || data.phoneNumber === null) {
          console.log('Skipping row with empty values:', data);
          return;
        }
        clients.push(data);
      })
      .on('end', () => {
        req.body.clientList = clients;
        console.log("_______clients_______",clients.length);
        next();
      });
  },
  clientApi.bulkCreateClient
);

// common constants

v2Routes.get('/gender-list', async (req, res) => {
  try {
    let genderlists = genderTypes;
    res.status(200).send({
      msg: 'Gender list get sucessfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: genderlists,
    });
  } catch (err) {
    console.log('___Gender List____', err);
    res.status(200).send({
      msg: 'Gender list get failed',
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
    });
  }
});

v2Routes.get('/appointment-status-list', async (req, res) => {
  try {
    let appointmentStatuslists = appointmentStatusTypes;
    res.status(200).send({
      msg: 'Appointment status list get sucessfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: appointmentStatuslists,
    });
  } catch (err) {
    res.status(200).send({
      msg: 'Appointment status list  get failed',
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
    });
  }
});

v2Routes.get('/service-slot-duration-list', async (req, res) => {
  try {
    let serviceSlotlists = tenantServiceDurationTypes;
    res.status(200).send({
      msg: 'Service slot duration list get sucessfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: serviceSlotlists,
    });
  } catch (err) {
    res.status(200).send({
      msg: 'Service slot duration list  get failed',
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
    });
  }
});

v2Routes.get('/service-slot-time-list', async (req, res) => {
  try {
    let serviceSlotlists = tenantServiceTimeTypes;
    res.status(200).send({
      msg: 'Service slot time list get sucessfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: serviceSlotlists,
    });
  } catch (err) {
    res.status(200).send({
      msg: 'Service slot time list  get failed',
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
    });
  }
});

v2Routes.get('/payment-types', async (req, res) => {
  try {
    let paymentTypesList = paymentTypes;
    res.status(200).send({
      msg: 'Payment type list get sucessfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: paymentTypesList,
    });
  } catch (err) {
    res.status(200).send({
      msg: 'Payment type list  get failed',
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
    });
  }
});

module.exports = v2Routes;
