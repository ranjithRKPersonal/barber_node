const { check, validationResult } = require('express-validator');
const { STATUS } = require('../constants/statusConstants');

exports.validateServiceSchema = [
    check('name')
    .isLength({ min: 3 })
    .withMessage('Valid categoryName required'),
    check('categoryId')
    .notEmpty()
    .withMessage('categoryId required'),
    check('location')
    .notEmpty()
    .withMessage('location required'),
    check('team')
    .notEmpty()
    .withMessage('team required'),
    check('priceAndDuration')
    .notEmpty()
    .withMessage('price And duration required')
    .isArray()
    .withMessage('price And duration type required as array')
];

exports.validateServiceRequest = (req, res, next) => {
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