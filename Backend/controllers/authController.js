// controllers/authController.js
const authService = require('../services/authService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthController {
    // Register a new user
    async createUser(req, res) {
        try {
            const {name, email, password, accountType, gender, contactNumber} = req.body;
            const newUser = await authService.createUser(name, email, password, accountType, gender, contactNumber);
            return res.status(201).json({ message: 'User created successfully', data: newUser });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Login a user
    async loginUser(req, res) {
        try {
          const { email, password } = req.body;
          const { user, token } = await authService.loginUser(email, password);
      
          res.cookie("token", token, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
          });
      
          return res.status(200).json({
            message: "Login successful",
            user,
            token,
          });
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
      }
      

    // Forgot password
    async forgotPassword(req, res) {
        try {
          const { email } = req.body;
          await authService.forgotPassword(email);
          return res.status(200).json({ message: 'OTP sent successfully' });
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
      }
      

    // Reset password
    async resetPassword(req, res) {
        try {
          const { email, otp, newPassword } = req.body;
          await authService.resetPassword(email, otp, newPassword);
          return res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
      }
      
}

module.exports = new AuthController();
