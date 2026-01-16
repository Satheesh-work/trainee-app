const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes (no authentication)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (with authentication)
router.get('/profile', protect, authController.getProfile);
router.put('/updatepassword', protect, authController.updatePassword);

module.exports = router;