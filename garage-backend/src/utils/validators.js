const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3-30 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const validateCustomer = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  handleValidationErrors,
];

const validateVehicle = [
  body('licensePlate').trim().notEmpty().withMessage('License plate is required'),
  body('make').notEmpty().withMessage('Vehicle make is required'),
  body('model').trim().notEmpty().withMessage('Vehicle model is required'),
  body('customer').notEmpty().withMessage('Customer is required'),
  handleValidationErrors,
];

const validateServiceRequest = [
  body('vehicle').notEmpty().withMessage('Vehicle is required'),
  body('customer').notEmpty().withMessage('Customer is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCustomer,
  validateVehicle,
  validateServiceRequest,
};
