const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../../logger/index');
const config = require('../../config/env.json');


const createProduct = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger createProduct service ] ');
    const Expense = await dbConnection.model('Product');
    let {
      name,
      amount,
      createdRole,
    } = req.body;

      const newExpense = new Expense({  name, amount, createdRole,  story: 1 });
      await newExpense.save();
      return newExpense;
  } catch (error) {
    logger.error(' [ Failed createProduct service ] ', error.message);
    throw new Error(error.message);
  }
};

const editProduct = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger editProduct service ] ');
    const Expense = await dbConnection.model('Product');
    let {
      name,
      amount
    } = req.body;
    const newExpense = await Expense.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          name,
          amount
        },
      },
      { new: true }
    );
    if (newExpense) return newExpense;
    else {
      throw Error('Failed newExpense service');
    }
  } catch (error) {
    logger.error(' [ Failed newExpense service ] ', error.message);
    throw new Error(error.message);
  }
};

const deleteProduct = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger deleteExpense service ] ');
    const Expense = await dbConnection.model('Product');
    const newExpense = await Expense.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          story: 3,
        },
      },
      { new: true }
    );
    if (newExpense) return newExpense;
    else throw new Error('Expense not found');
  } catch (error) {
    logger.error(' [ Failed deleteExpense service ] ', error.message);
    throw new Error(error.message);
  }
};

const getSingleProduct = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getSingleExpense service ] ');
    const Expense = await dbConnection.model('Product');
    const expenseFound = await Expense.findOne({
      _id: req.query._id,
      story: { $in: [1, 0, 2] },
    }).select(
      '_id name amount createdRole'
    );
    if (expenseFound) return expenseFound;
    else throw new Error('Failed getSingleExpense');
  } catch (error) {
    logger.error(' [ Failed getSingleExpense service ] ', error.message);
    throw new Error(error.message);
  }
};

const getAllProduct= async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllExpense service ] ');
    const Product = await dbConnection.model('Product');
    var query = {
      story: { $in: [1, 0, 2] }
    };
    const productListFound = await Product.aggregate([
      {
        $match:  query
      },
      { $sort: { expenseDate: -1 } },
    ]);
    if(productListFound) return { productList: productListFound };
    else throw new Error('Failed getAllClient');
  } catch (error) {
    logger.error(' [ Failed getAllClient service ] ', error.message);
    throw new Error(error.message);
  }
};


module.exports = {
  createProduct,
  editProduct,
  deleteProduct,
  getSingleProduct,
  getAllProduct
};
