const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../../logger/index');
const config = require('../../config/env.json');


const createExpense = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger createExpense service ] ');
    const Expense = await dbConnection.model('Expense');
    let {
      name,
      amount,
      createdRole,
      paymentType,
      expenseDate
    } = req.body;

      const newExpense = new Expense({  name, amount, createdRole,  paymentType, expenseDate,  story: 1 });
      await newExpense.save();
      return newExpense;
  } catch (error) {
    logger.error(' [ Failed createExpense service ] ', error.message);
    throw new Error(error.message);
  }
};

const editExpense = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger newExpense service ] ');
    const Expense = await dbConnection.model('Expense');
    let {
      name,
      amount,
      paymentType,
      expenseDate
    } = req.body;
    const newExpense = await Expense.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          name,
          amount,
          paymentType,
          expenseDate
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

const deleteExpense = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger deleteExpense service ] ');
    const Expense = await dbConnection.model('Expense');
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

const getSingleExpense = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getSingleExpense service ] ');
    const Expense = await dbConnection.model('Expense');
    const expenseFound = await Expense.findOne({
      _id: req.query._id,
      story: { $in: [1, 0, 2] },
    }).select(
      '_id name amount  paymentType expenseDate createdRole'
    );
    if (expenseFound) return expenseFound;
    else throw new Error('Failed getSingleExpense');
  } catch (error) {
    logger.error(' [ Failed getSingleExpense service ] ', error.message);
    throw new Error(error.message);
  }
};

const getAllExpense = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllExpense service ] ');
    const Expense = await dbConnection.model('Expense');
    var toDate =  `${new Date(req.query.toDate).getFullYear()}-${new Date(req.query.toDate).getMonth()+1}-${new Date(req.query.toDate).getDate() + 1}`;
    var query = {
      story: { $in: [1, 0, 2] },
      expenseDate: { $gte: new Date(req.query.fromDate), $lte: new Date(toDate) },
    };
    const expenseListFound = await Expense.aggregate([
      {
        $match:  query
      },
      { $sort: { expenseDate: -1 } },
    ]);
    var totalExpense = expenseListFound.reduce((totalExpense, currentValue) => {
      return totalExpense + parseInt(currentValue.amount);
    }, 0);
    if(expenseListFound) return { totalExpense: totalExpense, expenseListFound };
    else throw new Error('Failed getAllClient');
  } catch (error) {
    logger.error(' [ Failed getAllClient service ] ', error.message);
    throw new Error(error.message);
  }
};


module.exports = {
  createExpense,
  editExpense,
  deleteExpense,
  getSingleExpense,
  getAllExpense
};
