const { getConnection, connectAllDb } = require("../../../connectionManager");
const { STATUS } = require("../../../constants/statusConstants");
const { responseMessages } = require("../../../constants/responseMessage");
const logger = require("../../../logger/index");
const invoiceService = require("../../../service/invoice/index");


const createInvoice= async (req, res) => {
  try {
    logger.info(" [ Trigger createInvoiceController ] ", { meta: 1 });
    const dbConnection = getConnection();
    const Invoice= await invoiceService.createInvoice(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.CREATE_INVOICE_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: Invoice,
    });
    logger.info(" [ Success createInvoice] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed createInvoice] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.CREATE_INVOICE_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const editInvoice= async (req, res) => {
  try {
    logger.info(" [ Trigger editInvoiceController ] ", { meta: 1 });
    const dbConnection = getConnection();
    const Invoice= await invoiceService.editInvoice(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.EDIT_APPOINTMENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.PATCH_SUCCESS,
      data: Invoice,
    });
    logger.info(" [ Success editInvoice] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed editInvoice] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.EDIT_APPOINTMENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.PATCH_FAILED,
      error: err.message,
    });
  }
};

const deleteInvoice= async (req, res) => {
  try {
    logger.info(" [ Trigger deleteService Controller ] ", { meta: 1 });
    const dbConnection = req.dbConnection;
    const category = await invoiceService.deleteService(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.DELETE_SERVICE_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.DELETE_SUCCESS,
    });
    logger.info(" [ Success deleteService ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed deleteService ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.DELETE_SERVICE_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.DELETE_FAILED,
      error: err.message,
    });
  }
};

const getInvoice= async (req, res) => {
  try {
    logger.info(" [ Trigger getInvoiceController ] ", { meta: 1 });
    const dbConnection = getConnection();
    const service = await invoiceService.getInvoice(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_INVOICE_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(" [ Success getInvoice] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed getInvoice] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_INVOICE_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getAllInvoice= async (req, res) => {
  try {
    logger.info(" [ Trigger getAllInvoiceController ] ", { meta: 1 });
    const dbConnection = getConnection();
    const service = await invoiceService.getAllInvoice(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.GET_ALL_INVOICE_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(" [ Success getAllInvoice] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed getAllInvoice] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_INVOICE_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};


const getDashboardInvoiceList = async (req, res) => {
  try {
    logger.info(" [ Trigger getDashboardInvoiceList Controller ] ", {
      meta: 1,
    });
    const dbConnection = getConnection();
    const service = await invoiceService.getAllInvoiceDashboard(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.GET_DASHBOARD_INVOICE_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(" [ Success getDashboardInvoiceList ] ", { meta: 1 });
  } catch (err) {
    logger.error(" [ Failed getDashboardInvoiceList ] ", err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_DASHBOARD_INVOICE_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};


module.exports = {
    createInvoice,
    editInvoice,
    deleteInvoice,
    getInvoice,
    getAllInvoice,
    getDashboardInvoiceList,
};
