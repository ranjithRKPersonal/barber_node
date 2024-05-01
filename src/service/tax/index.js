const logger = require('../../logger/index');
const createTax = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger createTax service ] ');
    const Tax = await dbConnection.model('Tax');
    const taxExists = await Tax.findOne({
      name: req.body.name,
      story: { $in: [1, 0, 2] },
    });
    if (taxExists) throw new Error('Tax already exists');
    const newTax = new Tax({
      name: req.body.name,
      description: req.body.description,
      percentage: req.body.percentage,
      gstNumber: req.body.gstNumber,
      story: 0
    });
    await newTax.save();
    return newTax;
  } catch (error) {
    logger.error(' [ Failed createTax service ] ', error.message);
    throw new Error(error.message);
  }
};



const getAllTax = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllCategory service ] ');
    const Tax = await dbConnection.model('Tax');
    const taxListFound = await Tax.find({
      $nor: [
        {
          story: 3,
        },
      ],
    })
      .sort({ createdAt: -1 });
    if (taxListFound) return taxListFound;
    else throw new Error('Failed getAllTax');
  } catch (error) {
    logger.error(' [ Failed getAllTax service ] ');
    throw new Error(error.message);
  }
};


const editTax = async (dbConnection, req) => {
    try {
      logger.info(' [ Trigger editTax service ] ');
      const Tax = await dbConnection.model('Tax');
      // Retrieve the original record
      const taxFound = await Tax.findById(req.body._id);
  
      if (!taxFound) {
        throw new Error('Tax not found');
      }

  
      const taxUpdate = await Tax.findOneAndUpdate(
        { _id: req.body._id },
        {
          $set: {
            name: req.body.name,
            description: req.body.description,
            percentage: req.body.percentage,
            gstNumber: req.body.gstNumber,
            story: 1
          },
        },
        { new: true }
      );
      if (taxUpdate) return taxUpdate;
      else throw new Error('Failed editTax');
    } catch (error) {
      logger.error(' [ Failed editTax service ] ', error.message);
      throw new Error(error.message);
    }
  };
  
  const deleteTax = async (dbConnection, req) => {
    try {
      logger.info(' [ Trigger deleteCategory service ] ');
      const Tax = await dbConnection.model('Tax');
      const taxFound = await Tax.findOne({
        _id: req.body._id,
        story: { $in: [1, 0, 2] },
      });
      if (!taxFound) {
        throw new Error('Tax not found');
      }

      const taxUpdate = await Tax.findOneAndUpdate(
        { _id: req.body._id },
        {
          $set: {
            story: 3,
          },
        },
        { new: true }
      );
      if (taxUpdate) return taxUpdate;
      else throw new Error('Failed taxDelete');
    } catch (error) {
      logger.error(' [ Failed taxDelete service ] ', error.message);
      throw new Error(error.message);
    }
  };
  
  const getSingleTax = async (dbConnection, req) => {
    try {
      logger.info(' [ Trigger getSingleTax service ] ');
      const Tax = await dbConnection.model('Tax');
      const taxFound = await Tax.findOne({
        _id: req.query._id,
        story: { $in: [1, 0, 2] },
      })
      if (taxFound) return taxFound;
      else throw new Error('Failed getSingleTax');
    } catch (error) {
      logger.error(' [ Failed getSingleTax service ] ', error.message);
      throw new Error(error.message);
    }
  };
  

module.exports = {
  createTax,
  editTax,
  getAllTax,
  deleteTax,
  getSingleTax
};
