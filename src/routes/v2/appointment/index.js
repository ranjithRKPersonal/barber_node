const { STATUS } = require('../../../constants/statusConstants');
const { responseMessages } = require('../../../constants/responseMessage');
const logger = require('../../../logger/index');
const myServicesService = require('../../../service/services/index');
const appointmentService = require('../../../service/appointment/index');
const { getConnection } = require('../../../connectionManager');

const createAppointment = async (req, res) => {
  try {
    logger.info(' [ Trigger createAppointment Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const appointment = await appointmentService.createAppointment(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.CREATE_APPOINTMENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: appointment,
    });
    logger.info(' [ Success createAppointment ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed createAppointment ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.CREATE_APPOINTMENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const editAppointment = async (req, res) => {
  try {
    logger.info(' [ Trigger editAppointment Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const appointment = await appointmentService.editAppointment(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.EDIT_APPOINTMENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.PATCH_SUCCESS,
      data: appointment,
    });
    logger.info(' [ Success editAppointment ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed editAppointment ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.EDIT_APPOINTMENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.PATCH_FAILED,
      error: err.message,
    });
  }
};

const deleteService = async (req, res) => {
  try {
    logger.info(' [ Trigger deleteService Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const category = await myServicesService.deleteService(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.DELETE_SERVICE_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.DELETE_SUCCESS,
    });
    logger.info(' [ Success deleteService ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed deleteService ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.DELETE_SERVICE_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.DELETE_FAILED,
      error: err.message,
    });
  }
};

const getAppointment = async (req, res) => {
  try {
    logger.info(' [ Trigger getAppointment Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const service = await appointmentService.getAppointment(dbConnection, req);
    res.status(200).send({
      msg: responseMessages.GET_APPOINTMENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(' [ Success getAppointment ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed getAppointment ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_APPOINTMENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getAllAppointment = async (req, res) => {
  try {
    logger.info(' [ Trigger getAllAppointment Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const service = await appointmentService.getAllAppointment(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.GET_ALL_APPOINTMENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(' [ Success getAllAppointment ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed getAllAppointment ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_APPOINTMENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getAllAppointmentList = async (req, res) => {
  try {
    logger.info(' [ Trigger getAllAppointment Controller ] ', { meta: 1 });
    const dbConnection = getConnection();
    const service = await appointmentService.getAllAppointmentList(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.GET_ALL_APPOINTMENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(' [ Success getAllAppointment ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed getAllAppointment ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_APPOINTMENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getServiceListByCategory = async (req, res) => {
  try {
    logger.info(' [ Trigger getServiceListByCategory Controller ] ', {
      meta: 1,
    });
    const dbConnection = req.dbConnection;
    const service = await myServicesService.getServiceListByCategory(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.GET_ALL_SERVICE_BY_CATEGORY_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(' [ Success getServiceListByCategory ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed getServiceListByCategory ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_SERVICE_BY_CATEGORY_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getFilterAppointment = async (req, res) => {
  try {
    logger.info(' [ Trigger getFilterAppointment Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const service = await appointmentService.getFilterAppointment(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.GET_ALL_APPOINTMENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(' [ Success getFilterAppointment ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed getFilterAppointment ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_APPOINTMENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getDashboardAppointmentList = async (req, res) => {
  try {
    logger.info(' [ Trigger getDashboardAppointmentList Controller ] ', {
      meta: 1,
    });
    const dbConnection = req.dbConnection;
    const service = await appointmentService.getAllEntrysDashboard(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.GET_ALL_APPOINTMENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(' [ Success getDashboardAppointmentList ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed getDashboardAppointmentList ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_APPOINTMENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getSingleClientAllAppointment = async (req, res) => {
  try {
    logger.info(' [ Trigger getAllAppointment Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const service = await appointmentService.getSingleClientAllAppointment(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.GET_ALL_APPOINTMENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(' [ Success getAllAppointment ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed getAllAppointment ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_APPOINTMENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getAllAppointmentWithRelationShip = async (req, res) => {
  try {
    logger.info(' [ Trigger getAllAppointment Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const service = await appointmentService.getAllAppointmentWithRelationShip(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.GET_ALL_APPOINTMENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(' [ Success getAllAppointment ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed getAllAppointment ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_APPOINTMENT_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    logger.info(' [ Trigger updateAppointmentStatus Controller ] ', { meta: 1 });
    const dbConnection = req.dbConnection;
    const response = await appointmentService.updateAppointmentStatus(dbConnection, req)
    res.status(200).send({
      msg: responseMessages.GET_ALL_APPOINTMENT_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: response,
    });
  }
  catch (err) {
    logger.error(' [ Failed getAllOverviewList ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.GET_ALL_OVERVIEW_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};


const getAllOverviewList = async (req, res) => {
  try {
    logger.info(' [ Trigger getAllOverviewList Controller ] ', { meta: 1 });
    const dbConnection = getConnection();
    const service = await appointmentService.getAllOverviewList(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.EDIT_APPOINTMENT_STATUS_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.PATCH_SUCCESS,
      data: service,
    });
    logger.info(' [ Success updateAppointmentStatus ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed updateAppointmentStatus ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.EDIT_APPOINTMENT_STATUS_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.PATCH_FAILED,
      msg: responseMessages.GET_ALL_OVERVIEW_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: service,
    });
    logger.info(' [ Success getAllOverviewList ] ', { meta: 1 });
  }
}

const getDashBoardOverviewList = async (req, res) => {
  try {
    logger.info(' [ Trigger getAllOverviewList Controller ] ', { meta: 1 });
    const dbConnection = getConnection();
    const service = await appointmentService.getDashBoardOverviewList(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: responseMessages.EDIT_APPOINTMENT_STATUS_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.PATCH_SUCCESS,
      data: service,
    });
    logger.info(' [ Success updateAppointmentStatus ] ', { meta: 1 });
  } catch (err) {
    logger.error(' [ Failed updateAppointmentStatus ] ', err.message);
    res.status(err.statusCode || 500).send({
      msg: responseMessages.EDIT_APPOINTMENT_STATUS_FAILED,
      success: STATUS.FAILED,
      statusCode: STATUS.PATCH_FAILED,
      msg: responseMessages.GET_ALL_OVERVIEW_SUCCESS,
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS
    });
    logger.info(' [ Success getAllOverviewList ] ', { meta: 1 });
  }
}

module.exports = {
  createAppointment,
  editAppointment,
  deleteService,
  getAppointment,
  getAllAppointment,
  getServiceListByCategory,
  getFilterAppointment,
  getDashboardAppointmentList,
  getSingleClientAllAppointment,
  getAllAppointmentWithRelationShip,
  updateAppointmentStatus,
  getAllOverviewList,
  getAllAppointmentList,
  getDashBoardOverviewList
};
