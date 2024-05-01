const { check, validationResult } = require('express-validator');

exports.validateTenentRegisterRequest = [
    check('email')
    .isEmail()
    .withMessage('Valid Email is required'),
    check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 character long')
];

exports.validateSigninRequest = [
    check('email')
    .isEmail()
    .withMessage('Valid Email is required'),
    check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 character long')
];

exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){
        res.story = 'failed'
        return res.status(400).send({
             'msg': errors.array()[0].msg,
             'statusCode': 403
            })
    }
    res.story = 'success'
    next();
}