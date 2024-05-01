const { json } = require('express');
const bcrypt = require('bcrypt');
const { tenantServiceTimeTypes } = require('../../constants/serviceSlotTime');
const logger = require('../../logger/index');
const { BaseUrl, SubUrl } = require('../../constants/statusConstants');
const { default: axios } = require('axios');
const config = require('../../config/env.json');
const { getAllInvoiceByDateFilter } = require('../invoice');
const { getAllDraftByDateFilter } = require('../draft');
const { paymentTypes } = require('../../constants/paymentTypes');
const expenseService = require('../../service/expense/index');
const mongoose = require('mongoose');

function secondsToTime(seconds) {
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds - hours * 3600) / 60);
  var remainingSeconds = seconds % 60;

  // Add 0 before the values that are less than 10
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  remainingSeconds =
    remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

  // Determine AM or PM based on the hours
  var ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  return hours + ':' + minutes + ' ' + ampm;
}

function convertDate(dateString) {
  var date = new Date(dateString);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  return (
    (day < 10 ? '0' : '') +
    day +
    '/' +
    (month < 10 ? '0' : '') +
    month +
    '/' +
    year
  );
}
const sendAppointmentSMSTenant = async (
  mobileNumber,
  appointmentStatus,
  date,
  time
) => {
  const url = `${BaseUrl.MSG_91}${SubUrl.SEND_SINGLE_SMS}?
        template_id=${config.MSG_91_APPOINTMENT_ACKNOWLEDGEMENT_FLOW_ID}
        &authkey=${config.MSG_91_AUTH_KEY}`;
  console.log('__url_', url);
  var reqDetail = {
    method: 'post',
    url: url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
    },
    data: {
      flow_id: config.MSG_91_APPOINTMENT_ACKNOWLEDGEMENT_TENENT_FLOW_ID,
      sender: config.MSG_91_APPOINTMENT_SENDER_ID,
      mobiles: mobileNumber,
      DATE: date,
      TIME: time,
      APPOINTMENTSTATUS: appointmentStatus,
      template_id: config.MSG_91_APPOINTMENT_ACKNOWLEDGEMENT_TENENT_FLOW_ID,
      route: 1,
    },
  };
  await axios(reqDetail);
};

const sendAppointmentSMSClient = async (
  mobileNumber,
  appointmentStatus,
  userName
) => {
  const url = `${BaseUrl.MSG_91}${SubUrl.SEND_SINGLE_SMS}?
        template_id=${config.MSG_91_APPOINTMENT_ACKNOWLEDGEMENT_FLOW_ID}
        &authkey=${config.MSG_91_AUTH_KEY}`;
  var reqDetail = {
    method: 'post',
    url: url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
    },
    data: {
      flow_id: config.MSG_91_APPOINTMENT_ACKNOWLEDGEMENT_FLOW_ID,
      sender: config.MSG_91_APPOINTMENT_SENDER_ID,
      mobiles: mobileNumber,
      USER: userName,
      APPOINTMENTSTATUS: appointmentStatus,
      template_id: config.MSG_91_APPOINTMENT_ACKNOWLEDGEMENT_FLOW_ID,
      route: 1,
    },
  };
  await axios(reqDetail);
};

const createAppointment = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger createAppointment service ] ');
    const Appointment = await dbConnection.model('Appointment');
    const Client = await dbConnection.model('Client');
    var newClient;
    let {
      bookingDate,
      clientId,
      serviceIds,
      servicePriceList,
      totalPrice,
      discountPrice,
      createdRole,
      appointmentStatus,
      firstName,
      lastName,
      email,
      gender,
      countryCode,
      phoneNumber,
      userId,
      appointmentType,
      tax,
      spotDiscount
    } = req.body;
    if (!clientId && (createdRole == 'Admin' || createdRole =='Staff')) {
      let password = await bcrypt.hash(req.body.password, 10);
      newClient = new Client({
        firstName,
        lastName,
        email,
        gender,
        countryCode,
        phoneNumber,
        password,
        createdRole,
        myClient: true,
        roleId: 1,
      });
      await newClient.save();
      clientId = newClient._id;
    }
    bookingDate = new Date(bookingDate);
    const newAppointment = new Appointment({
      clientId,
      serviceIds,
      servicePriceList,
      totalPrice,
      discountPrice,
      createdRole,
      appointmentStatus,
      bookingDate,
      userId,
      appointmentType,
      tax,
      spotDiscount
    });
    await newAppointment.save();
    if (createdRole != 'Admin' || createdRole != 'Staff') {
      sendAppointmentSMSTenant(
        `${countryCode}${req.headers.tenantphonenumber}`,
        appointmentStatus,
        convertDate(bookingDate),
        secondsToTime(servicePriceList[0].startTime)
      );
    } else {
      sendAppointmentSMSClient(
        `${countryCode}${phoneNumber}`,
        appointmentStatus,
        firstName
      );
    }
    return newAppointment;
  } catch (error) {
    logger.error(' [ Failed createAppointment service ] ', error.message);
    throw new Error(error.message);
  }
};

const editAppointment = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger editAppointment service ] ');
    const Appointment = await dbConnection.model('Appointment');
    const Client = await dbConnection.model('Client');
    var newClient;
    let {
      bookingDate,
      clientId,
      serviceIds,
      servicePriceList,
      createdRole,
      appointmentStatus,
      userId,
      email,
      gender,
      password,
      tax,
      spotDiscount
    } = req.body;
    bookingDate = new Date(bookingDate);
    const newAppointment = await Appointment.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          clientId: clientId,
          serviceIds: serviceIds,
          servicePriceList: servicePriceList,
          createdRole: createdRole,
          appointmentStatus: appointmentStatus,
          bookingDate: bookingDate,
          userId: userId,
          tax: tax,
          spotDiscount: spotDiscount
        },
      },
      { new: true }
    );
    console.log('newAppointment', newAppointment);
    let { countryCode, firstName, phoneNumber } = req.body.clientId;
    if (newAppointment) {
      sendAppointmentSMSClient(
        `${countryCode}${phoneNumber}`,
        appointmentStatus,
        firstName
      );
      return newAppointment;
    } else throw Error('Failed to edit appointments');
  } catch (error) {
    console.log('___TEST___', error);
    logger.error(' [ Failed editAppointment service ] ', error.message);
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

const getAppointment = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAppointment service ] ');
    const Appointment = await dbConnection.model('Appointment');
    var serviceFound = await Appointment.findOne({
      _id: req.query._id,
      story: { $in: [1, 0, 2] },
    })
      .select(
        '_id bookingDate clientId serviceIds servicePriceList totalPrice discountPrice createdRole appointmentStatus tax spotDiscount'
      )
      .populate({
        path: 'clientId',
        select: '_id firstName lastName email gender countryCode phoneNumber',
      })
      .populate({
        path: 'userId',
        select:
          '_id firstName lastName email gender countryCode phoneNumber designation role',
      })
      .populate('serviceIds');
    if (serviceFound) {
      serviceFound.servicePriceList = serviceFound.servicePriceList.map(
        (data) => {
          serviceFound.serviceIds.filter((service) => {
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
        }
      );
      return serviceFound;
    } else throw new Error('Failed getAppointment');
  } catch (error) {
    console.log(error);
    logger.error(' [ Failed getAppointment service ] ', error.message);
    throw new Error(error.message);
  }
};

const getAllAppointment = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllAppointment service ] ');
    const Appointment = await dbConnection.model('Appointment');
    const Invoice = await dbConnection.model('Invoice');
    let invoiceList = await Invoice.find();
    const appointmentListFound = await Appointment.find({
      $nor: [
        {
          story: 3,
        },
      ],
    })
      .select(
        '_id bookingDate clientId serviceIds servicePriceList totalPrice discountPrice createdRole appointmentStatus tax spotDiscount'
      )
      .populate({
        path: 'clientId',
        select: '_id firstName lastName email gender countryCode phoneNumber',
      })
      .populate({
        path: 'userId',
        select:
          '_id firstName lastName email gender countryCode phoneNumber designation role',
      })
      .populate('serviceIds')
      .sort({ createdAt: -1 });
    let appointmentNewList = [];
    appointmentListFound.forEach((appointment) => {
      let appointmentData = {
        _id: appointment._id,
        client: appointment.clientId,
        createdRole: appointment.createdRole,
        appointmentStatus: appointment.appointmentStatus,
        bookingDate: appointment.bookingDate,
      };
      appointment.serviceIds.forEach((service, index) => {
        let priceItem = appointment.servicePriceList.filter(function (
          price,
          i
        ) {
          return price.serviceId == service._id && index == i;
        });
        priceItem = priceItem.map((data) => {
          data.startTime = tenantServiceTimeTypes.find(
            (item) => item.value == data.startTime
          );
          data.endTime = tenantServiceTimeTypes.find(
            (item) => item.value == data.endTime
          );
          return data;
        });
        appointmentNewList.push({
          appointmentData: appointmentData,
          service: service,
          priceItem: priceItem,
        });
      });
    });
    let invoiceListMap = {};
    invoiceList.forEach((data) => {
      invoiceListMap[data.appointmentId] = data._id;
    });

    appointmentNewList = appointmentNewList.map((data) => {
      let invoiceId = null;
      if (invoiceListMap[data.appointmentData._id]) {
        invoiceId = invoiceListMap[data.appointmentData._id];
      }
      return { invoiceId, ...data };
    });
    if (appointmentListFound) return appointmentNewList;
    else throw new Error('Failed getAllAppointment');
  } catch (error) {
    logger.error(' [ Failed getAllAppointment service ] ', error.message);
    throw new Error(error.message);
  }
};

const getAllAppointmentList = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllAppointmentList service ] ');
    const currentPage = req.query && req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query && req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = (currentPage - 1) * limit;
    const Client = await dbConnection.model('Client');

    var query = {
      $nor: [
        {
          story: 3,
        },
      ],
    };

    if(req.query.search) {
      let searchKey = req.query.search;
      var clientQuery = {
        $or: [
          { firstName: { $regex: searchKey, $options: 'i' } },
          { lastName: { $regex: searchKey, $options: 'i' } },
          { phoneNumber: { $regex: searchKey, $options: 'i' } }
        ]
      };
      var clientList = await Client.find(clientQuery).select('_id');
      clientList = clientList.map((data) => data._id);
      query = {
        clientId : { $in : clientList },
        $nor: [
          {
            story: 3,
          },
        ],
      }
    }
    else if(req.query.date && req.query.status) {
      const date = new Date(req.query.date);
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      query = {
        story: { $in: [1, 0, 2] },
        bookingDate: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
        appointmentStatus: req.query.status
      };
    }
    else if(req.query.date) {
      const date = new Date(req.query.date);
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      query = {
        story: { $in: [1, 0, 2] },
        bookingDate: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      };
    }
    else if(req.query.status) {
      query = {
        story: { $in: [1, 0, 2] },
        appointmentStatus: req.query.status
      };
    }

    const Appointment = await dbConnection.model('Appointment');
    const Invoice = await dbConnection.model('Invoice');
    let invoiceList = await Invoice.find();
    const appointmentListFound = await Appointment.find(query)
      .select(
        '_id bookingDate clientId serviceIds servicePriceList totalPrice discountPrice createdRole appointmentStatus tax spotDiscount'
      )
      .populate({
        path: 'clientId',
        select: '_id firstName lastName email gender countryCode phoneNumber',
      })
      .populate({
        path: 'userId',
        select:
          '_id firstName lastName email gender countryCode phoneNumber designation role',
      })
      .populate('serviceIds')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

      const totalCount = await Appointment.countDocuments(query);
      
      // Calculate the total number of pages
      const totalPages = Math.ceil(totalCount / limit);

    let appointmentNewList = [];
    appointmentListFound.forEach((appointment) => {
      let appointmentData = {
        _id: appointment._id,
        client: appointment.clientId,
        createdRole: appointment.createdRole,
        appointmentStatus: appointment.appointmentStatus,
        bookingDate: appointment.bookingDate,
      };
      let serviceList = [];
      let priceItemList = [];
      appointment.serviceIds.forEach((service, index) => {
        let priceItem = appointment.servicePriceList.filter(function (
          price,
          i
        ) {
          return price.serviceId == service._id && index == i;
        });
        priceItem = priceItem.map((data) => {
          data.startTime = tenantServiceTimeTypes.find(
            (item) => item.value == data.startTime
          );
          data.endTime = tenantServiceTimeTypes.find(
            (item) => item.value == data.endTime
          );
          return data;
        });
        serviceList.push(service);
        priceItemList.push(priceItem[0]);
      });

      appointmentNewList.push({
        appointmentData: appointmentData,
        service: serviceList,
        priceItem: priceItemList,
      });
    });
    let invoiceListMap = {};
    invoiceList.forEach((data) => {
      invoiceListMap[data.appointmentId] = data._id;
    });

    appointmentNewList = appointmentNewList.map((data) => {
      let invoiceId = null;
      if (invoiceListMap[data.appointmentData._id]) {
        invoiceId = invoiceListMap[data.appointmentData._id];
      }
      return { invoiceId, ...data };
    });
    if (appointmentListFound) {
      return {
        totalPages,
        total_count: totalCount,
        currentPage: currentPage,
        limit: limit,
        data: appointmentNewList,
      }
    }
    else throw new Error('Failed getAllAppointmentList');
  } catch (error) {
    logger.error(' [ Failed getAllAppointmentList service ] ', error.message);
    throw new Error(error.message);
  }
};

const getAllAppointmentByDateFilter = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllAppointment servicejkpppppppppp ] ');
    const Appointment = await dbConnection.model('Appointment');
    const Invoice = await dbConnection.model('Invoice');
    const filterQuery = req.query;;
    const date = new Date(filterQuery.date);
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    var  query = {
      story: { $in: [1, 0, 2] },
      bookingDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    };


    console.log("________query_____",query);

    let invoiceList = await Invoice.find();
    const appointmentListFound = await Appointment.find(query)
      .select(
        '_id bookingDate clientId serviceIds servicePriceList totalPrice discountPrice createdRole appointmentStatus tax spotDiscount'
      )
      .populate({
        path: 'clientId',
        select: '_id firstName lastName email gender countryCode phoneNumber',
      })
      .populate({
        path: 'userId',
        select:
          '_id firstName lastName email gender countryCode phoneNumber designation role',
      })
      .populate('serviceIds')
      .sort({ createdAt: -1 });
      let appointmentNewList = [];
      appointmentListFound.forEach((appointment) => {
        let appointmentData = {
          _id: appointment._id,
          client: appointment.clientId,
          createdRole: appointment.createdRole,
          appointmentStatus: appointment.appointmentStatus,
          bookingDate: appointment.bookingDate,
        };
        let serviceList = [];
        let priceItemList = [];
        appointment.serviceIds.forEach((service, index) => {
          let priceItem = appointment.servicePriceList.filter(function (
            price,
            i
          ) {
            return price.serviceId == service._id && index == i;
          });
          priceItem = priceItem.map((data) => {
            data.startTime = tenantServiceTimeTypes.find(
              (item) => item.value == data.startTime
            );
            data.endTime = tenantServiceTimeTypes.find(
              (item) => item.value == data.endTime
            );
            return data;
          });
          serviceList.push(service);
          priceItemList.push(priceItem[0]);
        });
  
        appointmentNewList.push({
          appointmentData: appointmentData,
          service: serviceList,
          priceItem: priceItemList,
        });
      });
      let invoiceListMap = {};
      invoiceList.forEach((data) => {
        invoiceListMap[data.appointmentId] = data._id;
      });
  
      appointmentNewList = appointmentNewList.map((data) => {
        let invoiceId = null;
        if (invoiceListMap[data.appointmentData._id]) {
          invoiceId = invoiceListMap[data.appointmentData._id];
        }
        return { invoiceId, ...data };
      });
    if (appointmentListFound) return  appointmentNewList;
    else throw new Error('Failed getAllAppointment');
  } catch (error) {
    logger.error(' [ Failed getAllAppointment service ] ', error.message);
    throw new Error(error.message);
  }
};

const getAllAppointmentByDateFilterForDashboard = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllAppointment servicejkpppppppppp ] ');
    const Invoice = await dbConnection.model('Invoice');
    const Appointment = await dbConnection.model('Appointment').collection.name;
    const ServiceCollectionName = await dbConnection.model('Service').collection
      .name;
    const ClientCollectionName = await dbConnection.model('Client').collection
      .name;
    const filterQuery = req.query;
    console.log("____filterQuery____",filterQuery);
    const fromDate = new Date(filterQuery.fromDate);
    const toDate = new Date(filterQuery.toDate);
    const startOfDay = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    const endOfDay = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate() + 1);
    var  query = {
      story: { $in: [1, 0, 2] },
      'appointment.bookingDate': {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    };

    console.log("________query_____",query);

    var invoiceList = await Invoice.aggregate([
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
        $match: query
      }
    ]).exec();
   
    return invoiceList && invoiceList.length > 0 ? invoiceList : [];
  } catch (error) {
    logger.error(' [ Failed getAllAppointment service ] ', error.message);
    throw new Error(error.message);
  }
};


const getServiceListByCategory = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getServiceListByCategory service ] ');
    const Service = await dbConnection.model('Service');
    const serviceListFound = await Service.find({
      categoryId: req.query.categoryId,
      $nor: [
        {
          story: 3,
        },
      ],
    }).select(
      '_id name description categoryId serviceGender location team priceAndDuration'
    );
    if (serviceListFound) return serviceListFound;
    else throw new Error('Failed getServiceListByCategory');
  } catch (error) {
    logger.error(
      ' [ Failed getServiceListByCategory service ] ',
      error.message
    );
    throw new Error(error.message);
  }
};

const getFilterAppointment = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getFilterAppointment service ] ');
    const Appointment = await dbConnection.model('Appointment');
    const filterQuery = req.query;
    var dateObj = new Date(filterQuery.date);
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var appointmentStatus =
      filterQuery.appointmentStatus && filterQuery.appointmentStatus.length > 0
        ? [filterQuery.appointmentStatus]
        : ['New', 'Confirmed', 'Cancelled', 'Completed'];
    let customDate = `${year}-${month}-${day}`;
    let fromLimit = customDate;
    let lastDate = fromLimit.split('-')[2].split('"')[0];
    let toLimit = `${fromLimit.split('-')[0]}-${fromLimit.split('-')[1]}-${
      parseInt(lastDate) + 1
    }`;

    query = {
      story: { $in: [1, 0, 2] },
      bookingDate: {
        $gte: new Date(fromLimit),
        $lt: new Date(toLimit),
      },
      appointmentStatus: { $in: appointmentStatus },
    };
    sortQuery = { createdAt: -1 };
    const appointmentListFound = await Appointment.find(query)
      .select(
        '_id bookingDate clientId serviceIds servicePriceList totalPrice discountPrice createdRole appointmentStatus tax spotDiscount'
      )
      .populate({
        path: 'clientId',
        select: '_id firstName lastName email gender countryCode phoneNumber',
      })
      .populate('serviceIds')
      .sort({ createdAt: -1 });

    let appointmentNewList = [];
    appointmentListFound.forEach((appointment) => {
      let appointmentData = {
        _id: appointment._id,
        client: appointment.clientId,
        createdRole: appointment.createdRole,
        appointmentStatus: appointment.appointmentStatus,
        bookingDate: appointment.bookingDate,
      };
      appointment.serviceIds.forEach((service) => {
        let priceItem = appointment.servicePriceList.filter(function (price) {
          return price.serviceId == service._id;
        });
        appointmentNewList.push({
          appointmentData: appointmentData,
          service: service,
          priceItem: priceItem,
        });
      });
    });
    if (appointmentListFound) return appointmentNewList;
    else throw new Error('Failed getFilterAppointment');
  } catch (error) {
    logger.error(' [ Failed getFilterAppointment service ] ', error.message);
    throw new Error(error.message);
  }
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

const getAllDashboardEntrys = (filter) => {
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
        bookingDate: { $gte: new Date(fromLimit), $lt: new Date(toLimit) },
      };
      break;
    }
    case 'Yesterday': {
      let fromLimit = `${year}-${month}-${day - 1}`;
      let toLimit = `${year}-${month}-${day}`;
      query = {
        story: { $in: [1, 0, 2] },
        bookingDate: { $gte: new Date(fromLimit), $lt: new Date(toLimit) },
      };
      break;
    }
    case 'LastWeek': {
      let fromLimit = `${year}-${month}-${day - 7}`;
      let toLimit = `${year}-${month}-${day}`;
      toLimit = addOneDay(toLimit);
      query = {
        story: { $in: [1, 0, 2] },
        bookingDate: { $gte: new Date(fromLimit), $lte: new Date(toLimit) },
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
        bookingDate: { $gte: new Date(fromLimit), $lte: new Date(toLimit) },
      };
      break;
    }
    default: {
      let fromLimit = `${year}-${month}-${day}`;
      query = {
        story: { $in: [1, 0, 2] },
        bookingDate: { $gt: new Date(fromLimit) },
      };
      break;
    }
  }
  return { query };
};

const convertAppointIntoService = async (appointmentList) => {
  let appointmentNewList = [];
  appointmentList.forEach((appointment) => {
    let appointmentData = {
      _id: appointment._id,
      client: appointment.clientId,
      createdRole: appointment.createdRole,
      appointmentStatus: appointment.appointmentStatus,
      bookingDate: appointment.bookingDate,
    };
    appointment.serviceIds.forEach((service) => {
      let priceItem = appointment.servicePriceList.filter(function (price) {
        return price.serviceId == service._id;
      });
      appointmentNewList.push({
        appointmentData: appointmentData,
        service: service,
        priceItem: priceItem,
      });
    });
  });
  return appointmentNewList;
};

const getAppointmentCountByStatus = async (appointmentList, status) => {
  appointmentList = appointmentList.filter((data) => {
    if (data.appointmentData.appointmentStatus == status) {
      return data;
    }
  });
  return appointmentList.length;
};

const getAllEntrysDashboard = async (dbConnection, req) => {
  try {
    const Appointment = await dbConnection.model('Appointment');
    let filterList = ['Today', 'Yesterday', 'LastWeek', 'LastMonth'];
    var queryList = [];
    filterList.forEach((data) => {
      queryList.push(getAllDashboardEntrys(data));
    });

    let queryListValues = {
      today: [
        {
          $match: queryList[0].query,
        },
      ],
      yesterday: [
        {
          $match: queryList[1].query,
        },
      ],
      lastWeek: [
        {
          $match: queryList[2].query,
        },
      ],
      lastMonth: [
        {
          $match: queryList[3].query,
        },
      ],
    };

    let appointmentListToday = await Appointment.aggregate(
      queryListValues.today
    );
    let appointmentListYesterday = await Appointment.aggregate(
      queryListValues.yesterday
    );
    let appointmentListLastweek = await Appointment.aggregate(
      queryListValues.lastWeek
    );
    let appointmentListLastmonth = await Appointment.aggregate(
      queryListValues.lastMonth
    );

    appointmentListToday = await convertAppointIntoService(
      appointmentListToday
    );
    appointmentListYesterday = await convertAppointIntoService(
      appointmentListYesterday
    );
    appointmentListLastweek = await convertAppointIntoService(
      appointmentListLastweek
    );
    appointmentListLastmonth = await convertAppointIntoService(
      appointmentListLastmonth
    );
    var appointmentListCount = {
      today: {
        total: appointmentListToday.length,
        new: await getAppointmentCountByStatus(appointmentListToday, 'New'),
        confirmed: await getAppointmentCountByStatus(
          appointmentListToday,
          'Confirmed'
        ),
        cancelled: await getAppointmentCountByStatus(
          appointmentListToday,
          'Cancelled'
        ),
        completed: await getAppointmentCountByStatus(
          appointmentListToday,
          'Completed'
        ),
        paid: await getAppointmentCountByStatus(appointmentListToday, 'Paid'),
      },
      yesterday: {
        total: appointmentListYesterday.length,
        new: await getAppointmentCountByStatus(appointmentListYesterday, 'New'),
        confirmed: await getAppointmentCountByStatus(
          appointmentListYesterday,
          'Confirmed'
        ),
        cancelled: await getAppointmentCountByStatus(
          appointmentListYesterday,
          'Cancelled'
        ),
        completed: await getAppointmentCountByStatus(
          appointmentListYesterday,
          'Completed'
        ),
        paid: await getAppointmentCountByStatus(
          appointmentListYesterday,
          'Paid'
        ),
      },
      lastWeek: {
        total: appointmentListLastweek.length,
        new: await getAppointmentCountByStatus(appointmentListLastweek, 'New'),
        confirmed: await getAppointmentCountByStatus(
          appointmentListLastweek,
          'Confirmed'
        ),
        cancelled: await getAppointmentCountByStatus(
          appointmentListLastweek,
          'Cancelled'
        ),
        completed: await getAppointmentCountByStatus(
          appointmentListLastweek,
          'Completed'
        ),
        paid: await getAppointmentCountByStatus(
          appointmentListLastweek,
          'Paid'
        ),
      },
      lastMonth: {
        total: appointmentListLastmonth.length,
        new: await getAppointmentCountByStatus(appointmentListLastmonth, 'New'),
        confirmed: await getAppointmentCountByStatus(
          appointmentListLastmonth,
          'Confirmed'
        ),
        cancelled: await getAppointmentCountByStatus(
          appointmentListLastmonth,
          'Cancelled'
        ),
        completed: await getAppointmentCountByStatus(
          appointmentListLastmonth,
          'Completed'
        ),
        paid: await getAppointmentCountByStatus(
          appointmentListLastmonth,
          'Paid'
        ),
      },
    };

    let response = {
      data: appointmentListCount,
    };
    return response;
  } catch (error) {
    console.log('Faild to get appointent lists error', error);
    throw error;
  }
};

const getSingleClientAllAppointment = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllAppointment service ] ');
    const Appointment = await dbConnection.model('Appointment');
    const Invoice = await dbConnection.model('Invoice');
    let invoiceList = await Invoice.find();
    const appointmentListFound = await Appointment.find({
      clientId: req.query.clientId,

      $nor: [
        {
          story: 3,
        },
      ],
    })
      .select(
        '_id bookingDate clientId serviceIds servicePriceList totalPrice discountPrice createdRole appointmentStatus tax spotDiscount'
      )
      .populate({
        path: 'clientId',
        select: '_id firstName lastName email gender countryCode phoneNumber',
      })
      .populate('serviceIds')
      .sort({ createdAt: -1 });
    let appointmentNewList = [];
    appointmentListFound.forEach((appointment) => {
      let appointmentData = {
        _id: appointment._id,
        client: appointment.clientId,
        createdRole: appointment.createdRole,
        appointmentStatus: appointment.appointmentStatus,
        bookingDate: appointment.bookingDate,
      };
      const newServiceTimeFormat = (appointment.servicePriceList =
        appointment.servicePriceList.map((data) => {
          appointment.serviceIds.filter((service) => {
            if (service._id == data.serviceId) {
              data.service = {
                name: service.name,
                description: service.description,
              };
              data.service.startTime = tenantServiceTimeTypes.filter(
                (timeData) => {
                  if (timeData.labelWithoutText == data.startTime) return data;
                }
              );
              data.service.endTime = tenantServiceTimeTypes.filter(
                (timeData) => {
                  if (timeData.labelWithoutText == data.endTime) return data;
                }
              );
              data.service.price = data.price;
            }
          });
          return data;
        }));

      appointmentNewList.push({
        appointmentData: appointmentData,
        service: appointment.serviceIds,
        priceItem: appointment.servicePriceList,
        newServiceTimeFormat: newServiceTimeFormat,
      });
    });
    let invoiceListMap = {};
    invoiceList.forEach((data) => {
      invoiceListMap[data.appointmentId] = data._id;
    });

    appointmentNewList = appointmentNewList.map((data) => {
      let invoiceId = null;
      if (invoiceListMap[data.appointmentData._id]) {
        invoiceId = invoiceListMap[data.appointmentData._id];
      }
      return { invoiceId, ...data };
    });
    if (appointmentListFound) return appointmentNewList;
    else throw new Error('Failed getAppointment');
    // if (appointmentListFound) return appointmentListFound;
    // else throw new Error("Failed getAllAppointment");
  } catch (error) {
    logger.error(' [ Failed getAllAppointment service ] ', error.message);
    throw new Error(error.message);
  }
};

const getAllAppointmentWithRelationShip = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllAppointment service ] ');
    const Appointment = await dbConnection.model('Appointment');
    const appointmentListFound = await Appointment.find({
      $nor: [
        {
          story: 3,
        },
      ],
    })
      .select(
        '_id bookingDate clientId serviceIds servicePriceList totalPrice discountPrice createdRole appointmentStatus tax spotDiscount'
      )
      .populate({
        path: 'clientId',
        select: '_id firstName lastName email gender countryCode phoneNumber',
      })
      .populate('serviceIds')
      .sort({ createdAt: -1 });
    let appointmentNewList = [];
    appointmentListFound.forEach((appointment) => {
      let appointmentData = {
        _id: appointment._id,
        client: appointment.clientId,
        createdRole: appointment.createdRole,
        appointmentStatus: appointment.appointmentStatus,
        bookingDate: appointment.bookingDate,
      };
      const newServiceTimeFormat = (appointment.servicePriceList =
        appointment.servicePriceList.map((data) => {
          appointment.serviceIds.filter((service) => {
            if (service._id == data.serviceId) {
              data.service = {
                name: service.name,
                description: service.description,
              };
              data.service.startTime = tenantServiceTimeTypes.filter(
                (timeData) => {
                  if (timeData.labelWithoutText == data.startTime) return data;
                }
              );
              data.service.endTime = tenantServiceTimeTypes.filter(
                (timeData) => {
                  if (timeData.labelWithoutText == data.endTime) return data;
                }
              );
              data.service.price = data.price;
            }
          });
          return data;
        }));

      appointmentNewList.push({
        appointmentData: appointmentData,
        service: appointment.serviceIds,
        priceItem: appointment.servicePriceList,

        newServiceTimeFormat: newServiceTimeFormat,
      });
    });

    if (appointmentListFound) return appointmentNewList;
    else throw new Error('Failed getAppointment');
  } catch (error) {
    logger.error(' [ Failed getAllAppointment service ] ', error.message);
    throw new Error(error.message);
  }
};

const updateAppointmentStatus = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger updateAppointmentStatus service ] ');
    const Appointment = await dbConnection.model('Appointment');
    let {
      appointmentStatus,
    } = req.body;
    const newAppointment = await Appointment.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          appointmentStatus: appointmentStatus,
        },
      },
      { new: true }
    );
    console.log('updateAppointmentStatus', newAppointment);
  } catch (error) {
    console.log('___TEST___', error);
    logger.error(' [ Failed updateAppointmentStatus service ] ', error.message);
  }
}

const getAllOverviewList = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllOverviewList service ] ');
    var appointentList = await getAllAppointmentByDateFilter(dbConnection, req);
    var draftList = await getAllDraftByDateFilter(dbConnection,req);
    const ticketList = appointentList.concat(draftList);
    return ticketList;
  } catch (error) {
    logger.error(' [ Failed getAllOverviewList service ] ', error.message);
    throw new Error(error.message);
  }
};

const getDashBoardListData = async(req, dbConnection, invoiceList) => {
     try {
     var dashboardDataList = {
      sales: {
        totalSale : 0,
        list: []
      },
      invoice: {
        toatlInvoice: 0,
        list: []
      },
      staff: {
        totalStaff: 0,
        list: []
      },
      expense: {
        totalExpense: 0,
        list: []
      }
     };

     invoiceList.forEach((invoice) => {

        // Total Sale Calculation

        dashboardDataList.sales.totalSale += invoice.totalPrice;
        var index = dashboardDataList.sales.list.findIndex((data) => data.paymentType == invoice.paymentType);
        console.log("+++TEST____NEW____",invoice);
        if(index == -1)
        dashboardDataList.sales.list.push({ paymentType: invoice.paymentType, totalPrice: invoice.totalPrice, ...paymentTypes[invoice.paymentType-1]});
        else 
        dashboardDataList.sales.list[index].totalPrice +=  invoice.totalPrice

        // Invoice Calculation

        var invoicePayload = { totalPrice: invoice.totalPrice , clientDetails : {} , serviceList: [] , invoiceDetails: { _id : invoice._id , invoiceNumber: invoice.invoiceNumber } };
        dashboardDataList.invoice.toatlInvoice += 1;
        invoicePayload.clientDetails = invoice.appointment.client;
        invoice.appointment.services = invoice.appointment.services.map((data) => {
          return { _id : data._id , name : data.name }
        })
        invoicePayload.serviceList = invoice.appointment.services;
        dashboardDataList.invoice.list.push(invoicePayload);

        // Staff Calculation

        invoice.appointment.servicePriceList.map((servicePriceItem) => {
          var index = invoice.appointment.services.findIndex((data) => data._id == servicePriceItem.serviceId);
          servicePriceItem.name = invoice.appointment.services[index].name;
          return servicePriceItem;
        });

        invoice.appointment.servicePriceList.forEach((data) => {
          var staffIndex = dashboardDataList.staff.list.findIndex((staffItem) => staffItem?._id == data?.staff?._id);
          if(staffIndex == -1) {
            dashboardDataList.staff.list.push({ _id : data?.staff?._id , name: data?.staff?.value, 
              serviceList: [{ _id : data.serviceId , name : data.name , price: data.price, count : parseInt(data.qty), totalPrice: parseInt(data.price) }]
            });
          }
          else {
            var serviceIndex = dashboardDataList.staff.list[staffIndex].serviceList.findIndex((serviceItem) => serviceItem._id == data.serviceId);
            if(serviceIndex != -1) {
              dashboardDataList.staff.list[staffIndex].serviceList[serviceIndex].count +=  parseInt(data.qty);
              dashboardDataList.staff.list[staffIndex].serviceList[serviceIndex].totalPrice += parseInt(dashboardDataList.staff.list[staffIndex].serviceList[serviceIndex].totalPrice);
            }
            else {
              dashboardDataList.staff.list[staffIndex].serviceList.push({ _id : data.serviceId , name : data.name , price: data.price, count : parseInt(data.qty), totalPrice: parseInt(data.price) });
            }
          }
        })
        dashboardDataList.staff.totalStaff = dashboardDataList.staff.list.length;
     })

     var expenseData = await expenseService.getAllExpense(dbConnection, req);
     
     if(expenseData?.totalExpense && expenseData?.expenseListFound) {
        dashboardDataList.expense.totalExpense = expenseData?.totalExpense;
        expenseData.expenseListFound = expenseData?.expenseListFound.map((data) => {
          return {...data,paymentType: paymentTypes[data.paymentType-1].name}
        })
        dashboardDataList.expense.list = expenseData?.expenseListFound;
     }

     return dashboardDataList;
    } 
    catch(err) {
      console.log("__ERROR___",err);
      var dashboardDataList = {
        sales: {
          totalSale : 0,
          list: []
        },
        invoice: {
          toatlInvoice: 0,
          list: []
        },
        staff: {
          totalStaff: 0,
          list: []
        },
        expense: {
          totalExpense: 0,
          list: []
        }
       };
      return dashboardDataList;
    }
}

const getDashBoardOverviewList = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllOverviewList service ] ');
    var invoiceList = await getAllAppointmentByDateFilterForDashboard(dbConnection, req);
    invoiceList =  await getDashBoardListData(req, dbConnection, invoiceList);
    return invoiceList;
  } catch (error) {
    logger.error(' [ Failed getAllOverviewList service ] ', error.message);
    throw new Error(error.message);
  }
};


module.exports = {
  createAppointment,
  editAppointment,
  deleteService,
  getAppointment,
  getAllAppointment,
  getServiceListByCategory,
  getFilterAppointment,
  getAllDashboardEntrys,
  getAllEntrysDashboard,
  convertAppointIntoService,
  getSingleClientAllAppointment,
  getAllAppointmentWithRelationShip,
  updateAppointmentStatus,
  getAllOverviewList,
  getAllAppointmentByDateFilter,
  getAllAppointmentList,
  getDashBoardOverviewList,
  getAllAppointmentByDateFilterForDashboard
};
