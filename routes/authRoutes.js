const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidator, loginValidator, updatePasswordValidator } = require('../validators/authValidator');
const validate = require('../middleware/validate');

// Public routes (no authentication)
router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);

// Protected routes (with authentication)
router.get('/profile', protect, authController.getProfile);
router.put('/updatepassword', protect, updatePasswordValidator, validate, authController.updatePassword);

module.exports = router;