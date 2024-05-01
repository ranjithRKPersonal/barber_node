const logger = require('../../logger/index');
const createCategory = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger createCategory service ] ');
    const Category = await dbConnection.model('Category');
    const categoryExists = await Category.findOne({
      name: req.body.name,
      story: { $in: [1, 0, 2] },
    });
    if (categoryExists) throw new Error('Category already exists');
    const newCategory = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    await newCategory.save();
    return newCategory;
  } catch (error) {
    logger.error(' [ Failed createCategory service ] ', error.message);
    throw new Error(error.message);
  }
};

const editCategory = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger editCategory service ] ');
    const Category = await dbConnection.model('Category');
    // Retrieve the original record
    const originalUser = await Category.findById(req.body._id);

    if (!originalUser) {
      throw new Error('Category not found');
    }
    // Check for duplicates
    const duplicateUser = await Category.findOne({
      name: req.body.name,
    });

    if (duplicateUser && duplicateUser._id.toString() !== req.body._id) {
      throw new Error('Category already exits');
    }

    const newCategory = await Category.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
        },
      },
      { new: true }
    );
    if (newCategory) return newCategory;
    else throw new Error('Failed editCategory');
  } catch (error) {
    logger.error(' [ Failed editCategory service ] ', error.message);
    throw new Error(error.message);
  }
};

const deleteCategory = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger deleteCategory service ] ');
    const Category = await dbConnection.model('Category');
    const Service = await dbConnection.model('Service');
    const serviceFound = await Service.findOne({
      categoryId: req.body._id,
      story: { $in: [1, 0, 2] },
    });
    if (serviceFound) {
      throw new Error('Cannot delete category, category contains services');
    }
    const newCategory = await Category.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          story: 3,
        },
      },
      { new: true }
    );
    if (newCategory) return newCategory;
    else throw new Error('Failed deleteCategory');
  } catch (error) {
    logger.error(' [ Failed deleteCategory service ] ', error.message);
    throw new Error(error.message);
  }
};

const getSingleCategory = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getSingleCategory service ] ');
    const Category = await dbConnection.model('Category');
    const categoryFound = await Category.findOne({
      _id: req.query._id,
      story: { $in: [1, 0, 2] },
    }).select('_id name description');
    if (categoryFound) return categoryFound;
    else throw new Error('Failed getSingleCategory');
  } catch (error) {
    logger.error(' [ Failed getSingleCategory service ] ', error.message);
    throw new Error(error.message);
  }
};

const getAllCategory = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllCategory service ] ');
    const Category = await dbConnection.model('Category');
    const categoryListFound = await Category.find({
      $nor: [
        {
          story: 3,
        },
      ],
    })
      .select('_id name description createdAt')
      .sort({ createdAt: -1 });
    if (categoryListFound) return categoryListFound;
    else throw new Error('Failed getAllCategory');
  } catch (error) {
    logger.error(' [ Failed getAllCategory service ] ');
    throw new Error(error.message);
  }
};

const getAllUsedCategory = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllUsedCategory service ] ');
    const Category = await dbConnection.model('Category');
    const Service = await dbConnection.model('Service');
    var serviceList = await Service.find({
      $nor: [
        {
          story: 3,
        },
      ],
    }).select('categoryId');
    serviceList = serviceList.map((data) => {
      return data.categoryId.toString();
    });
    const categoryListFound = await Category.find({
      _id: { $in: serviceList },
      $nor: [
        {
          story: 3,
        },
      ],
    })
      .select('_id name description createdAt')
      .sort({ createdAt: -1 });
    if (categoryListFound) return categoryListFound;
    else throw new Error('Failed getAllUsedCategory');
  } catch (error) {
    logger.error(' [ Failed getAllUsedCategory service ] ');
    throw new Error(error.message);
  }
};

module.exports = {
  createCategory,
  editCategory,
  deleteCategory,
  getSingleCategory,
  getAllCategory,
  getAllUsedCategory,
};
