// routes/authRoutes.js
const express = require('express');
const { createUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

// Register user
router.post('/register', createUser);

// Login user
router.post('/login', loginUser);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password using OTP
router.post('/reset-password', resetPassword);

module.exports = router;
