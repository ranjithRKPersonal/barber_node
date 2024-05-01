const { check, validationResult } = require('express-validator');
const { STATUS } = require('../constants/statusConstants');

exports.validateAppointmentSchema = [
    check('bookingDate')
    .notEmpty()
    .withMessage('booking date required'),
    check('serviceIds')
    .notEmpty()
    .withMessage('serviceIds required')
    .isArray()
    .withMessage('serviceIds should be array'),
    check('servicePriceList')
    .notEmpty()
    .withMessage('servicePriceList required')
    .isArray()
    .withMessage('servicePriceList should be array')
];

exports.validateAppointmentRequest = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){
       return res.status(200).send({
            msg: errors.array()[0].msg,
            success: STATUS.FAILED,
            statusCode: STATUS.POST_FAILED
          });
    }
    next();
}