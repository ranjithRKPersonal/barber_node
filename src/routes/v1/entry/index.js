const { getConnection } = require('../../../connectionManager');
const { STATUS } = require('../../../constants/statusConstants');
const entryService = require('../../../service/entry/index');

const createEntry = async (req, res) => {
  try {
    const dbConnection = req.dbConnection ? req.dbConnection : getConnection();
    const tenant = await entryService.createEntry(dbConnection, req);
    res.status(200).send({
      msg: 'Entry register succssfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: tenant,
    });
  } catch (err) {
    console.log('Entry error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message || 'Entry register failed',
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const addEntryKey = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const tenant = await entryService.addEntryKey(dbConnection, req);
    res.status(200).send({
      msg: 'Entry register succssfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.POST_SUCCESS,
      data: tenant,
    });
  } catch (err) {
    console.log('Entry error', err);
    res.status(err.statusCode || 500).send({
      msg: err.message || 'Entry register failed',
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const getAllEntrys = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const entryList = await entryService.getAllEntrys(dbConnection, req);
    res.status(200).send({
      msg: 'Get all entrys succssfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: entryList,
    });
  } catch (err) {
    console.log('Get entry failed', err);
    res.status(err.statusCode || 500).send({
      msg: err.message || 'Entry register failed',
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const filterAllEntrys = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const entryList = await entryService.filterAllEntrys(dbConnection, req);
    res.status(200).send({
      msg: 'Get all entrys succssfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: entryList,
    });
  } catch (err) {
    console.log('Get entry failed', err);
    res.status(err.statusCode || 500).send({
      msg: err.message || 'Entry register failed',
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};

const filterAllEntrysDashboard = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const entryList = await entryService.getAllEntrysDashboard(
      dbConnection,
      req
    );
    res.status(200).send({
      msg: 'Get all entrys succssfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.GET_SUCCESS,
      data: entryList,
    });
  } catch (err) {
    console.log('Get entry failed', err);
    res.status(err.statusCode || 500).send({
      msg: err.message || 'Get all entrys failed',
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
      error: err.message,
    });
  }
};
const deleteEntry = async (req, res) => {
  try {
    const dbConnection = req.dbConnection;
    let entryDeleteStatus = await entryService.deleteEntry(dbConnection, req);
    res.status(200).send({
      msg: 'Entry deleted succssfully',
      success: STATUS.SUCCESS,
      statusCode: STATUS.DELETE_SUCCESS,
      data: entryDeleteStatus,
    });
  } catch (err) {
    console.log('error', err);
    res.status(err.statusCode || 500).send({
      msg: 'Entry delete failed',
      success: STATUS.FAILED,
      statusCode: STATUS.DELETE_FAILED,
      error: err.message,
    });
  }
};
const getEntry = async (req, res) => {
  try {
    const dbConnection = req.dbConnection;
    let product = await entryService.getEntry(dbConnection, req);
    if (product) {
      res.status(200).send({
        msg: 'Get entry succssfully',
        success: STATUS.SUCCESS,
        statusCode: STATUS.POST_SUCCESS,
        data: product,
      });
    } else {
      throw new Error('Entry not exits ');
    }
  } catch (err) {
    console.log('fetchAll error', err);
    res.status(err.statusCode || 500).send({
      msg: 'Get entry Failed',
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const getAllEntry = async (req, res) => {
  try {
    const dbConnection = req.dbConnection;
    let product = await entryService.getAllEntry(dbConnection, req);
    if (product) {
      res.status(200).send({
        msg: 'Get entry list succssfully',
        success: STATUS.SUCCESS,
        statusCode: STATUS.POST_SUCCESS,
        data: product,
      });
    } else {
      throw new Error('Entry list not exits ');
    }
  } catch (err) {
    console.log('fetchAll error', err);
    res.status(err.statusCode || 500).send({
      msg: 'Get entry list Failed',
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};

const editEntry = async (req, res) => {
  try {
    const dbConnection = req.dbConnection;
    console.log(dbConnection.name, 'Tenant db name');
    let product = await entryService.editEntry(dbConnection, req);
    if (product) {
      res.status(200).send({
        msg: 'Edit entry succssfully',
        success: STATUS.SUCCESS,
        statusCode: STATUS.POST_SUCCESS,
        data: product,
      });
    } else {
      throw new Error('Edit entry Failed');
    }
  } catch (err) {
    console.log('error', err);
    res.status(err.statusCode || 500).send({
      msg: 'Edit entry Failed',
      success: STATUS.FAILED,
      statusCode: STATUS.GET_FAILED,
      error: err.message,
    });
  }
};
module.exports = {
  createEntry,
  getAllEntrys,
  filterAllEntrys,
  filterAllEntrysDashboard,
  addEntryKey,
  deleteEntry,
  getEntry,
  editEntry,
  getAllEntry,
};
