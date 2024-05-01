const { check, validationResult } = require('express-validator');
const { STATUS } = require('../constants/statusConstants');

exports.validateClientSchema = [
  check('firstName')
    .isLength({ min: 3 })
    .withMessage('Valid FirstName required'),
  check('countryCode').notEmpty().withMessage('CountryCode required'),
  check('phoneNumber').notEmpty().withMessage('PhoneNumber required'),
  // check('createdRole')
  // .notEmpty()
  // .withMessage('CreatedRole required')
];

exports.validateServiceRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(200).send({
      msg: errors.array()[0].msg,
      success: STATUS.FAILED,
      statusCode: STATUS.POST_FAILED,
    });
  }
  next();
};
