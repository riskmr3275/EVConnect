// services/authService.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models"); 
const {OTP} = require("../models"); 
class AuthService {
  // Register user
  async createUser(userData) {
    const { name, email, password, accountType, gender, contactNumber } =
      userData;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      ...userData,
      password: hashedPassword,
    });

    return newUser;
  }

  // Login user
  async loginUser(req, res) {
    const { email, password } = req.body;

    // Find user by email using Prisma
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, accountType: user.accountType },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    console.log(token); // Log the token

    // Save token to user record (optional)
    await prisma.user.update({
      where: { email },
      data: { token },
    });


    // Set token in cookies (expires in 30 days)
    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true, // Cookie accessible only by the web server
    };

    // Send cookie and response
    res.cookie("token", token, options).status(200).json({
      success: true,
      user,
      message: "User Login Success",
    });
  }

  // Forgot password (send reset email with OTP)
  async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

    // Generate OTP and send email (use a service like nodemailer)
    const otp = Math.floor(100000 + Math.random() * 900000); // Generating a random 6-digit OTP

    // Here, you should send an email with the OTP to the user
    console.log(`OTP for password reset: ${otp}`);

    // nodemailer for otp sending here:




    const otpModel=await prisma.otp.create({
      data: {
        otp: otp,
        userId: user.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // OTP valid for 15 minutes
      },
    });

    // Store OTP in the database (you may want to expire it after a certain time)
    // Example: store the OTP with its expiration time (e.g., 15 minutes)

    return res.status(200).json({sucess:true,message:"OTP sent successfully"});
  }

  // Reset password with the OTP
  async resetPassword(email, otp, newPassword) {
    try {
      
        const user = await prisma.user.findFirst({
            where: { email },
          });
        
          

      if (!user) {
        throw new Error("User not found");
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await user.save();
      return true;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}

module.exports = new AuthService();
