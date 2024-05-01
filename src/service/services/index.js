const logger = require('../../logger/index');
const createService = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger createService service ] ');
    const Service = await dbConnection.model('Service');
    const Category = await dbConnection.model('Category');
    const categoryFound = await Category.findOne({
      _id: req.body.categoryId,
      story: { $in: [1, 0, 2] },
    });
    if (categoryFound) {
      const serviceExists = await Service.findOne({
        name: req.body.name,
        story: { $in: [1, 0, 2] },
      });
      if (serviceExists) throw new Error('Service already exists');
      let {
        name,
        description,
        categoryId,
        serviceGender,
        location,
        team,
        priceAndDuration,
      } = req.body;
      const newService = new Service({
        name,
        description,
        categoryId,
        serviceGender,
        location,
        team,
        priceAndDuration,
      });
      await newService.save();
      return newService;
    } else {
      throw new Error('Category not found');
    }
  } catch (error) {
    logger.error(' [ Failed createService service ] ', error.message);
    throw new Error(error.message);
  }
};

const editService = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger editService service ] ');
    const Service = await dbConnection.model('Service');
    const Category = await dbConnection.model('Category');
    const categoryFound = await Category.findOne({
      _id: req.body.categoryId,
      story: { $in: [1, 0, 2] },
    });
    if (categoryFound) {
      let {
        name,
        description,
        categoryId,
        serviceGender,
        location,
        team,
        priceAndDuration,
      } = req.body;
      const newService = await Service.findOneAndUpdate(
        { _id: req.body._id },
        {
          $set: {
            name: name,
            description: description,
            categoryId: categoryId,
            serviceGender: serviceGender,
            location: location,
            team: team,
            priceAndDuration: priceAndDuration,
          },
        },
        { new: true }
      );
      if (newService) return newService;
      else throw Error('Failed editService service  ');
    } else {
      throw new Error('Category not found');
    }
  } catch (error) {
    logger.error(' [ Failed editService service ] ', error.message);
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

const getSingleService = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getSingleService service ] ');
    const Service = await dbConnection.model('Service');
    const serviceFound = await Service.findOne({
      _id: req.query._id,
      story: { $in: [1, 0, 2] },
    })
      .select(
        '_id name description categoryId serviceGender location team priceAndDuration'
      )
      .populate({ path: 'categoryId', select: '_id name description story' });
    if (serviceFound) return serviceFound;
    else throw new Error('Failed getSingleService');
  } catch (error) {
    logger.error(' [ Failed getSingleService service ] ', error.message);
    throw new Error(error.message);
  }
};

const getAllService = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllService service ] ');
    const Service = await dbConnection.model('Service');
    const serviceListFound = await Service.find({
      $nor: [
        {
          story: 3,
        },
      ],
    })
      .select(
        '_id name description categoryId serviceGender location team priceAndDuration createdAt'
      )
      .populate({ path: 'categoryId', select: '_id name description story' })
      .sort({ createdAt: -1 });
    if (serviceListFound) return serviceListFound;
    else throw new Error('Failed getAllService');
  } catch (error) {
    logger.error(' [ Failed getAllService service ] ', error.message);
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
    })
      .select(
        '_id name description categoryId serviceGender location team priceAndDuration'
      )
      .sort({ createdAt: -1 });
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

module.exports = {
  createService,
  editService,
  deleteService,
  getSingleService,
  getAllService,
  getServiceListByCategory,
};
