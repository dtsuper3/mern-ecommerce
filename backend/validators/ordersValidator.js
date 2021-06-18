const { check } = require("express-validator");

function postOrderValidator() {
    return [
        check('orderItems')
            .notEmpty()
            .withMessage('orderItems is required')
            .isArray()
            .isLength({ min: 1 })
            .withMessage('Add atleast one orderItem'),
        check('shippingAddress1')
            .notEmpty()
            .withMessage("Shipping Address 1 is required"),
        check('zip')
            .notEmpty()
            .withMessage("zip is required"),
        check('city')
            .notEmpty()
            .withMessage("city is required"),
        check('city')
            .notEmpty()
            .withMessage("city is required"),
        check('phone')
            .notEmpty()
            .withMessage("phone is required"),
    ]
}

module.exports = {
    postOrderValidator
}