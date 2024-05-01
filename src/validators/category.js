const { check, validationResult } = require('express-validator');
const { STATUS } = require('../constants/statusConstants');

exports.validateCategorySchema = [
    check('name')
    .isLength({ min: 3 })
    .withMessage('Valid categoryName required')
];

exports.validateCategoryRequest = (req, res, next) => {
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