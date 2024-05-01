const { tenantServiceTimeTypes } = require('../../constants/serviceSlotTime');
const logger = require('../../logger/index');

const createDraft = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger createDraft service ] ');
    const Draft = await dbConnection.model('Draft');
    let {
      bookingDate,
      clientId,
      serviceIds,
      servicePriceList,
      discountPrice,
      createdRole,
      appointmentStatus,
      userId,
      appointmentType,
      tax,
      spotDiscount,
      totalPrice,
      isCustomPrice,
      paymentType,
      draftType,
      firstName,
      phoneNumber,
      countryCode
    } = req.body;

    if(bookingDate)
    bookingDate = new Date(bookingDate);

    const newDraft = new Draft({
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
      spotDiscount,
      isCustomPrice,
      paymentType,
      draftType,
      firstName,
      phoneNumber,
      countryCode
    });

    await newDraft.save();
    return newDraft;
  } catch (error) {
    logger.error(' [ Failed createDraft service ] ', error.message);
    throw new Error(error.message);
  }
};

const editDraft = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger editDraft service ] ');
    const Draft = await dbConnection.model('Draft');
    let {
      bookingDate,
      clientId,
      serviceIds,
      servicePriceList,
      discountPrice,
      createdRole,
      appointmentStatus,
      userId,
      appointmentType,
      tax,
      spotDiscount,
      totalPrice,
      isCustomPrice,
      paymentType,
      draftType,
      firstName,
      phoneNumber,
      countryCode
    } = req.body;

    if(bookingDate)
    bookingDate = new Date(bookingDate);

    const newDraft = await Draft.findOneAndUpdate(
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
          spotDiscount: spotDiscount,
          isCustomPrice: isCustomPrice,
          paymentType: paymentType,
          draftType: draftType,
          totalPrice: totalPrice,
          discountPrice: discountPrice,
          appointmentType: appointmentType,
          firstName: firstName,
          phoneNumber: phoneNumber,
          countryCode: countryCode
        },
      },
      { new: true }
    );

    if (newDraft) {
      return newDraft;
    } else throw Error('Failed to update draft');
  } catch (error) {
    console.log('___TEST___', error);
    logger.error(' [ Failed editDraft service ] ', error.message);
    throw new Error(error.message);
  }
};

const deleteDraft = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger deleteDraft service ] ');
    const Draft = await dbConnection.model('Draft');
    const newDraft = await Draft.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          story: 3,
        },
      },
      { new: true }
    );
    if (newDraft) return newDraft;
    else throw new Error('Draft not found');
  } catch (error) {
    logger.error(' [ Failed deleteDraft service ] ', error.message);
    throw new Error(error.message);
  }
};

const getDraft = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getDraft service ] ');
    const Draft = await dbConnection.model('Draft');
    console.log('___req.query._id___',req.query._id);
    var draftFound = await Draft.findOne({
      _id: req.query._id,
      story: { $in: [1, 0, 2] },
    })
      .populate({
        path: 'clientId'
      })
      .populate({
        path: 'userId'
      })
      .populate('serviceIds');
    if (draftFound) {
        draftFound.servicePriceList = draftFound.servicePriceList.map(
        (data) => {
            draftFound.serviceIds.filter((service) => {
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

      var draftPayload = {
        appointment : {
          serviceIds:draftFound.serviceIds,
          servicePriceList: draftFound.servicePriceList,
          tax: draftFound.tax,
          clientId: draftFound.clientId && draftFound.clientId != null ? draftFound.clientId  : {
          firstName: draftFound.firstName,
          lastName: draftFound.lastName,
          countryCode: draftFound.countryCode,
          phoneNumber: draftFound.phoneNumber,
          email: draftFound.email,
          gender: draftFound.gender
          },
          "appointmentStatus": draftFound.appointmentStatus,
          "bookingDate": draftFound.bookingDate,
          "appointmentType": draftFound.appointmentType,
        },
        _id: draftFound._id,
        "isCustomPrice": draftFound.isCustomPrice,
        "story": draftFound.story,
        "createdRole": draftFound.createdRole,
        "totalPrice": draftFound.totalPrice,
        "paymentType": draftFound.paymentType,
        "createdAt": draftFound.createdAt,
        "updatedAt": draftFound.updatedAt,
        "__v": 0,
      };
      return draftPayload;
    } else throw new Error('Failed getDraft');
  } catch (error) {
    console.log(error);
    logger.error(' [ Failed getDraft service ] ', error.message);
    throw new Error(error.message);
  }
};

const getAllDraft = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllDraft service ] ');
    const Draft = await dbConnection.model('Draft');
    const draftListFound = await Draft.find({
      $nor: [
        {
          story: 3,
        },
      ],
    })
      .select(
        '_id bookingDate firstName countryCode phoneNumber clientId serviceIds servicePriceList totalPrice discountPrice createdRole appointmentStatus tax spotDiscount draftType totalPrice isCustomPrice paymentType'
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

    if (draftListFound) return draftListFound;
    else throw new Error('Failed getAllDraft');
  } catch (error) {
    logger.error(' [ Failed getAllDraft service ] ', error.message);
    throw new Error(error.message);
  }
};

const getAllDraftByDateFilter = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllDraft service ] ');
    const Draft = await dbConnection.model('Draft');
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

    const draftListFound = await Draft.find(query)
      .select(
        '_id bookingDate firstName countryCode phoneNumber clientId serviceIds servicePriceList totalPrice discountPrice createdRole appointmentStatus tax spotDiscount draftType totalPrice isCustomPrice paymentType'
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

    if (draftListFound) return draftListFound;
    else throw new Error('Failed getAllDraft');
  } catch (error) {
    logger.error(' [ Failed getAllDraft service ] ', error.message);
    throw new Error(error.message);
  }
};


module.exports = {
  createDraft,
  editDraft,
  deleteDraft,
  getAllDraft,
  getDraft,
  getAllDraftByDateFilter
};
