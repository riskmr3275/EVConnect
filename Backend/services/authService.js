// services/authService.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const { User } = require("../models");
// const { OTP } = require("../models");
const  prisma  = require("../config/database");


class AuthService {
  // Register user
  async createUser(name, email, password, accountType, gender, contactNumber) {
    //check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          accountType,
          gender,
          contactNumber,
        },
      });

      return newUser;
  }

  // Login user
  async loginUser(email, password) {
    console.log("Data",email, password);
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    console.log("Daghua",user);
    if (!user) {
      throw new Error("User not found");
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
  
    const token = jwt.sign(
      { userId: user.id,name:user.name, email: user.email, accountType: user.accountType },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
  
    await prisma.user.update({
      where: { email },
      data: { token },
    });
  
    return {user, token };
  }
  

  // Forgot password (send reset email with OTP)
  // authService.js
async forgotPassword(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  await prisma.OTP.create({
    data: {
      otp: String(otp), 
      userId: user.id,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      isUsed: false,
    },
  });

  console.log(`OTP for password reset: ${otp}`);
  return true;
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

      const otpRecord = await prisma.OTP.findFirst({
        where: {
          userId: user.id,
          otp: otp,
          expiresAt: {
            gte: new Date(), // Check if OTP is not expired
          },
        },
      })

      if (!otpRecord) {
        throw new Error("Invalid or expired OTP");
      }

      if (otpRecord.isUsed) {
        throw new Error("OTP already used");
      }

      await prisma.OTP.update({
        where: { id: otpRecord.id },
        data: { isUsed: true },
      });
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      }); 



      return true;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    try {
      const { name, email, contactNumber, dateOfBirth, gender, about, address, city, state, zipCode } = updateData;

      // Update user basic info
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(contactNumber && { contactNumber }),
          ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
          ...(gender && { gender }),
          ...(about !== undefined && { about }),
        },
        include: {
          userDetails: true
        }
      });

      // Update or create user details
      if (address || city || state || zipCode) {
        await prisma.userDetails.upsert({
          where: { userId },
          update: {
            ...(address !== undefined && { address }),
            ...(city && { city }),
            ...(state && { state }),
            ...(zipCode && { zipCode }),
          },
          create: {
            userId,
            address: address || '',
            city: city || '',
            state: state || '',
            zipCode: zipCode || '',
          }
        });
      }

      // Fetch updated user with details
      const userWithDetails = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          userDetails: true
        }
      });

      // Remove password from response
      const { password, ...userResponse } = userWithDetails;
      return userResponse;

    } catch (error) {
      console.error("Error updating profile:", error);
      throw new Error("Failed to update profile");
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Get user with current password
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      });

      return true;

    } catch (error) {
      console.error("Error changing password:", error);
      throw new Error(error.message || "Failed to change password");
    }
  }
}

module.exports = new AuthService();
