// routes/authRoutes.js
const express = require('express');
const router = express.Router();

const { createUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');



// Register user
router.post('/register', createUser);

// Login user
router.post('/login', loginUser);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password using OTP
router.post('/reset-password', resetPassword);

module.exports = router;
