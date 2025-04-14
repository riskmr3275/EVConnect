const prisma = require("../config/database");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class StationMasterServices {
  async createStationMaster(data) {
    console.log("Creating station master with data:", data);
    const {
      name,
      email,
      password,
      contactNumber,
      accountType,
      gender,
      dateOfBirth,
      stationId,
      shift,
      user
    } = data;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    if (accountType !== "STATIONMASTER") {
      throw new Error("Invalid account type");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await prisma.$transaction(async (tx) => {
      const stationMaster = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          contactNumber,
          accountType,
          gender,
          dateOfBirth,
        },
      });

      const stationMasterAdditionalInfo = await tx.stationMasterDetails.create({
        data: {
          userId: stationMaster.id,
          stationId,
          shift,
          ownerId: user.userId,
        },
      });

      return {
        result,
        ...stationMaster,
        stationMasterDetails: stationMasterAdditionalInfo,
      };
    });
  }
}

module.exports = new StationMasterServices();