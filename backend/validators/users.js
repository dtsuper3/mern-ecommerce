const { check } = require("express-validator");

exports.registerValidator = () => {
    return [
        check('name')
            .notEmpty()
            .withMessage("name is required"),
        check('email')
            .notEmpty()
            .withMessage("email is required")
            .isEmail()
            .not()
            .withMessage("email is not valid"),
        check('phone')
            .notEmpty()
            .withMessage("phone is required")
            .isLength({ min: 10 })
            .withMessage('phone number must be 10 characters'),
        check('password')
            .notEmpty()
            .withMessage('password is required')
            .isLength({ min: 8 })
            .withMessage('password must be 8 characters')
    ]
}

exports.loginValidator = () => {
    return [
        check('email')
            .notEmpty()
            .withMessage("email is required")
            .isEmail()
            .not()
            .withMessage("email is not valid"),
        check('password')
            .notEmpty()
            .withMessage('password is required')
            .isLength({ min: 8 })
            .withMessage('password must be 8 characters')
    ]
}