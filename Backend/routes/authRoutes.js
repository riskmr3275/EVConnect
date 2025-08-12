// routes/authRoutes.js
const express = require('express');
const router = express.Router();

const { createUser, loginUser, forgotPassword, resetPassword, updateProfile, changePassword } = require('../controllers/authController');
const { auth } = require('../middlewares/Auth');



// Register user
router.post('/register', createUser);

// Login user
router.post('/login', loginUser);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password using OTP
router.post('/reset-password', resetPassword);

// Update profile (protected route)
router.put('/update-profile', auth, updateProfile);

// Change password (protected route)
router.put('/change-password', auth, changePassword);

module.exports = router;
