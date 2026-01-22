const { body } = require('express-validator');

exports.registerValidator = [
    body('name') // Read req.body.name
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('age')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Age must be a positive number'),

    body('password')
        .isStrongPassword({
            minLength: 8,
            minUppercase: 1,
            minNumbers: 1
        })
        .withMessage('Password must be at least 8 characters and include uppercase and number')
];

exports.loginValidator = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .notEmpty().withMessage('Password is required')
];

exports.updatePasswordValidator = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),

    body('newPassword')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
];