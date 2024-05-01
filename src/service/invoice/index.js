const { json } = require('express');
const { tenantServiceTimeTypes } = require('../../constants/serviceSlotTime');
const logger = require('../../logger/index');
const { BaseUrl, SubUrl } = require('../../constants/statusConstants');
const { default: axios } = require('axios');
const config = require('../../config/env.json');
const mongoose = require('mongoose');
const generateInvoice = async (dbConnection) => {
  try {
    const Appointment = await dbConnection.model('Appointment');
    const Invoice = await dbConnection.model('Invoice');
    let query = {
      story: { $in: [1, 0, 2] },
      appointmentStatus: 'Completed',
    };
    let appointmentList = await Appointment.find(query);
    console.log('+++appointmentLis++++', appointmentList.length);
    appointmentList.forEach(async (appointment, index) => {
      let invoiceNumber = index + 1;
      var totalPrice = 0;
      appointment.servicePriceList.forEach((currentValue) => {
        let currentPrice =
          parseInt(currentValue.discountPrice) > 0
            ? parseInt(currentValue.discountPrice)
            : parseInt(currentValue.price);
        totalPrice = totalPrice + currentPrice;
      });

      let invoicePayload = {
        appointmentId: appointment._id,
        totalPrice: totalPrice,
        isCustomPrice: false,
        createdRole: 'Admin',
        paymentType: 1,
        invoiceNumber,
      };
      const newInvoice = new Invoice(invoicePayload);
      await newInvoice.save();
    });
  } catch (err) {
    console.log('___ERROR to generate invoice', err);
  }
};

const sumInvoicePriceByList = async (invoiceList) => {
  let totalSale = 0;
  invoiceList.forEach((invoice) => {
    totalSale += invoice.totalPrice;
  });
  return totalSale;
};

function addOneDay(date) {
  var lastDay = new Date(
    new Date(date).getFullYear(),
    new Date(date).getMonth() + 1,
    0
  );
  if (new Date(date).getDate() === new Date(lastDay).getDate()) {
    return new Date(
      new Date(date).getFullYear(),
      new Date(date).getMonth() + 1,
      1
    );
  } else {
    return new Date(
      new Date(date).getFullYear(),
      new Date(date).getMonth(),
      new Date(date).getDate() + 1
    );
  }
}

const createInvoice = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger createInvoice service ] ');
    const Invoice = await dbConnection.model('Invoice');
    const invoiceNumber =
      (await dbConnection.model('Invoice').countDocuments()) + 1;
    let { appointmentId, createdRole, totalPrice, isCustomPrice, paymentType } =
      req.body;
    const newInvoice = new Invoice({
      appointmentId,
      createdRole,
      totalPrice,
      isCustomPrice,
      paymentType,
      invoiceNumber,
    });
    await newInvoice.save();
    return newInvoice;
  } catch (error) {
    logger.error(' [ Failed createInvoice service ] ', error.message);
    throw new Error(error.message);
  }
};

const editInvoice = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger editInvoice service ] ');
    const Invoice = await dbConnection.model('Invoice');
    let { createdRole, totalPrice, isCustomPrice, paymentType } = req.body;
    const newInvoice = await Invoice.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          createdRole,
          totalPrice,
          isCustomPrice,
          paymentType,
        },
      },
      { new: true }
    );
    console.log('newInvoice', newInvoice);
    if (newInvoice) {
      return newInvoice;
    } else throw Error('Failed to edit Invoices');
  } catch (error) {
    console.log('___TEST___', error);
    logger.error(' [ Failed editInvoice service ] ', error.message);
    throw new Error(error.message);
  }
};

const deleteService = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger deleteService service ] ');
    const Service = await dbConnection.model('Service');
    const newService = await Service.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          story: 3,
        },
      },
      { new: true }
    );
    if (newService) return newService;
    else throw new Error('Service not found');
  } catch (error) {
    logger.error(' [ Failed deleteService service ] ', error.message);
    throw new Error(error.message);
  }
};

const getInvoice = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getInvoice service ] ');
    const Invoice = await dbConnection.model('Invoice');
    const Appointment = await dbConnection.model('Appointment').collection.name;
    const ServiceCollectionName = await dbConnection.model('Service').collection
      .name;
    const ClientCollectionName = await dbConnection.model('Client').collection
      .name;
    var invoiceFound = await Invoice.aggregate([
      {
        $lookup: {
          from: Appointment,
          localField: 'appointmentId',
          foreignField: '_id',
          as: 'appointment',
        },
      },
      {
        $unwind: '$appointment',
      },
      {
        $lookup: {
          from: ClientCollectionName,
          localField: 'appointment.clientId',
          foreignField: '_id',
          as: 'appointment.clientId',
        },
      },
      {
        $lookup: {
          from: ServiceCollectionName,
          localField: 'appointment.serviceIds',
          foreignField: '_id',
          as: 'appointment.serviceIds',
        },
      },
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.query._id),
        },
      },
    ]).exec();
    if (invoiceFound.length > 0) {
      invoiceFound[0].appointment.servicePriceList =
        invoiceFound[0].appointment.servicePriceList.map((data) => {
          invoiceFound[0].appointment.serviceIds.filter((service) => {
            if (service._id == data.serviceId) {
              data.service = {
                name: service.name,
                description: service.description,
              };
              data.service.startTime = tenantServiceTimeTypes.filter(
                (timeData) => {
                  if (timeData.value == data.startTime) return data;
                }
              );
              data.service.endTime = tenantServiceTimeTypes.filter(
                (timeData) => {
                  if (timeData.value == data.endTime) return data;
                }
              );
              data.service.price = data.price;
            }
          });
          return data;
        });

      return invoiceFound[0];
    } else throw new Error('invoice not found');
  } catch (error) {
    console.log(error);
    logger.error(' [ Failed getInvoice service ] ', error.message);
    throw new Error(error.message);
  }
};

const getAllInvoice = async (dbConnection, req) => {
  try {
    const currentPage = req.query && req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query && req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = (currentPage - 1) * limit;
    console.log("____currentPage____",limit,skip,currentPage);
    logger.info(' [ Trigger getAllInvoice service ] ');
    const Invoice = await dbConnection.model('Invoice');
    const Appointment = await dbConnection.model('Appointment').collection.name;
    const ServiceCollectionName = await dbConnection.model('Service').collection
      .name;
    const ClientCollectionName = await dbConnection.model('Client').collection
      .name;
    var InvoiceListFound = []; 
    if(req.query && req.query.page) {
     InvoiceListFound = await Invoice.aggregate([
      {
        $lookup: {
          from: Appointment,
          localField: 'appointmentId',
          foreignField: '_id',
          as: 'appointment',
        },
      },
      {
        $unwind: '$appointment',
      },
      {
        $lookup: {
          from: ClientCollectionName,
          localField: 'appointment.clientId',
          foreignField: '_id',
          as: 'appointment.client',
        },
      },
      {
        $lookup: {
          from: ServiceCollectionName,
          localField: 'appointment.serviceIds',
          foreignField: '_id',
          as: 'appointment.services',
        },
      },
      {
        $match: {
          story: 0,
        },
      },
      {
        $facet: {
            paginatedResults: [
                {$sort: {createdAt: -1}},
                {$skip: skip},
                {$limit: limit},
            ],
            totalCount: [
                {
                    $count: 'count',
                },
            ],
        },
    },
    ]).exec();
    if (InvoiceListFound) {
      return  { 'list': InvoiceListFound[0]?.paginatedResults ?InvoiceListFound[0]?.paginatedResults : []
       ,'totalCount':InvoiceListFound[0]?.totalCount ? InvoiceListFound[0]?.totalCount : 0 };
    } else throw new Error('Failed getAllInvoice');
    }
    else {
      InvoiceListFound = await Invoice.aggregate([
        {
          $lookup: {
            from: Appointment,
            localField: 'appointmentId',
            foreignField: '_id',
            as: 'appointment',
          },
        },
        {
          $unwind: '$appointment',
        },
        {
          $lookup: {
            from: ClientCollectionName,
            localField: 'appointment.clientId',
            foreignField: '_id',
            as: 'appointment.client',
          },
        },
        {
          $lookup: {
            from: ServiceCollectionName,
            localField: 'appointment.serviceIds',
            foreignField: '_id',
            as: 'appointment.services',
          },
        },
        {
          $match: {
            story: 0,
          },
        },
      ]).exec();
      if (InvoiceListFound) {
        return   { 'list': InvoiceListFound,'totalCount':InvoiceListFound.length };
      } else throw new Error('Failed getAllInvoice');
    }

  } catch (error) {
    logger.error(' [ Failed getAllInvoice service ] ', error.message);
    throw new Error(error.message);
  }
};

const getAllInvoiceDashboard = async (dbConnection, req) => {
  try {
    const Appointment = await dbConnection.model('Appointment');
    const Invoice = await dbConnection.model('Invoice');
    let filterList = ['Today', 'Yesterday', 'LastWeek', 'LastMonth'];
    var queryList = [];
    const AppointmentCollectionName = await dbConnection.model('Appointment')
      .collection.name;
    filterList.forEach((data) => {
      queryList.push(getAllInvoiceDashboardEntrys(data));
    });

    let queryListValues = {
      today: [
        {
          $lookup: {
            from: AppointmentCollectionName,
            localField: 'appointmentId',
            foreignField: '_id',
            as: 'appointment',
          },
        },
        {
          $match: queryList[0].query,
        },
      ],
      yesterday: [
        {
          $lookup: {
            from: AppointmentCollectionName,
            localField: 'appointmentId',
            foreignField: '_id',
            as: 'appointment',
          },
        },
        {
          $match: queryList[1].query,
        },
      ],
      lastWeek: [
        {
          $lookup: {
            from: AppointmentCollectionName,
            localField: 'appointmentId',
            foreignField: '_id',
            as: 'appointment',
          },
        },
        {
          $match: queryList[2].query,
        },
      ],
      lastMonth: [
        {
          $lookup: {
            from: AppointmentCollectionName,
            localField: 'appointmentId',
            foreignField: '_id',
            as: 'appointment',
          },
        },
        {
          $match: queryList[3].query,
        },
      ],
    };

    let invoiceListToday = await Invoice.aggregate(queryListValues.today);
    let invoiceListYesterday = await Invoice.aggregate(
      queryListValues.yesterday
    );
    let invoiceListLastweek = await Invoice.aggregate(queryListValues.lastWeek);
    let invoiceListLastmonth = await Invoice.aggregate(
      queryListValues.lastMonth
    );

    let invoiceCostoday = await sumInvoicePriceByList(invoiceListToday);
    let invoiceCostodayYesterday = await sumInvoicePriceByList(
      invoiceListYesterday
    );
    let invoiceCostodayLastweek = await sumInvoicePriceByList(
      invoiceListLastweek
    );
    let invoiceCostodayLastmonth = await sumInvoicePriceByList(
      invoiceListLastmonth
    );
    var invoiceListCount = {
      today: {
        total: invoiceListToday.length,
        totalSales: invoiceCostoday,
      },
      yesterday: {
        total: invoiceListYesterday.length,
        totalSales: invoiceCostodayYesterday,
      },
      lastWeek: {
        total: invoiceListLastweek.length,
        totalSales: invoiceCostodayLastweek,
      },
      lastMonth: {
        total: invoiceListLastmonth.length,
        totalSales: invoiceCostodayLastmonth,
      },
    };

    let response = {
      data: invoiceListCount,
    };
    return response;
  } catch (error) {
    console.log('Faild to get invoice lists error', error);
    throw error;
  }
};

const getAllInvoiceDashboardEntrys = (filter) => {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1;
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  var query;

  switch (filter) {
    case 'Today': {
      let customDate = `${year}-${month}-${day}`;
      let fromLimit = customDate;
      let lastDate = fromLimit.split('-')[2].split('"')[0];
      let toLimit = `${fromLimit.split('-')[0]}-${
        fromLimit.split('-')[1]
      }-${parseInt(lastDate)}`;
      toLimit = addOneDay(toLimit);
      query = {
        story: { $in: [1, 0, 2] },
        'appointment.bookingDate': {
          $gte: new Date(fromLimit),
          $lt: new Date(toLimit),
        },
      };
      break;
    }
    case 'Yesterday': {
      let fromLimit = `${year}-${month}-${day - 1}`;
      let toLimit = `${year}-${month}-${day}`;
      query = {
        story: { $in: [1, 0, 2] },
        'appointment.bookingDate': {
          $gte: new Date(fromLimit),
          $lt: new Date(toLimit),
        },
      };
      break;
    }
    case 'LastWeek': {
      let fromLimit = `${year}-${month}-${day - 7}`;
      let toLimit = `${year}-${month}-${day}`;
      toLimit = addOneDay(toLimit);
      query = {
        story: { $in: [1, 0, 2] },
        'appointment.bookingDate': {
          $gte: new Date(fromLimit),
          $lte: new Date(toLimit),
        },
      };
      break;
    }
    case 'LastMonth': {
      let lastMonthModifier = month == 1 ? 12 : month - 1;
      let fromLimit = `${year}-${month - lastMonthModifier}-${day}`;
      let toLimit = `${year}-${month}-${day}`;
      toLimit = addOneDay(toLimit);
      query = {
        story: { $in: [1, 0, 2] },
        'appointment.bookingDate': {
          $gte: new Date(fromLimit),
          $lte: new Date(toLimit),
        },
      };
      break;
    }
    default: {
      let fromLimit = `${year}-${month}-${day}`;
      query = {
        story: { $in: [1, 0, 2] },
        'appointment.bookingDate': { $gt: new Date(fromLimit) },
      };
      break;
    }
  }
  return { query };
};

const getAllInvoiceByDateFilter = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllInvoice service ] ');
    const Invoice = await dbConnection.model('Invoice');
    const Appointment = await dbConnection.model('Appointment').collection.name;
    const ServiceCollectionName = await dbConnection.model('Service').collection
      .name;
    const ClientCollectionName = await dbConnection.model('Client').collection
      .name;

      const filterQuery = req.query;;
      const date = new Date(filterQuery.date);
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      var  query = {
        story: { $in: [1, 0, 2] },
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      };

    const InvoiceListFound = await Invoice.aggregate([
      {
        $lookup: {
          from: Appointment,
          localField: 'appointmentId',
          foreignField: '_id',
          as: 'appointment',
        },
      },
      {
        $unwind: '$appointment',
      },
      {
        $lookup: {
          from: ClientCollectionName,
          localField: 'appointment.clientId',
          foreignField: '_id',
          as: 'appointment.client',
        },
      },
      {
        $lookup: {
          from: ServiceCollectionName,
          localField: 'appointment.serviceIds',
          foreignField: '_id',
          as: 'appointment.services',
        },
      },
      {
        $match: query,
      },
    ]).exec();

    if (InvoiceListFound) {
      return InvoiceListFound;
    } else throw new Error('Failed getAllInvoice');
  } catch (error) {
    logger.error(' [ Failed getAllInvoice service ] ', error.message);
    throw new Error(error.message);
  }
};

module.exports = {
  createInvoice,
  editInvoice,
  deleteService,
  getInvoice,
  getAllInvoice,
  getAllInvoiceDashboard,
  getAllInvoiceByDateFilter
};
