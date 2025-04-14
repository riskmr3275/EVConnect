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
        const { stationMaster, stationMasterAdditionalInfo } = await prisma.$transaction(async (tx) => {
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
    
          return { stationMaster, stationMasterAdditionalInfo };
        });
    
        return {
          stationMaster,
          stationMasterAdditionalInfo,
        };
      }
      async getStationMasterById(id) {
        // Fetch the station master by ID
        const stationMaster = await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                stationMasterDetails: true, // Include related station master details
            },
        });
    
        if (!stationMaster) {
            throw new Error("Station Master not found");
        }
    
        return stationMaster;
    }
    
    async updateStationMaster(id, updatedData) {
        // Update the station master details
        const { name, email, contactNumber, gender, dateOfBirth, stationId, shift } = updatedData;
    
        const updatedStationMaster = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                name,
                email,
                contactNumber,
                gender,
                dateOfBirth,
            },
        });
    
        // Update station master additional details
        await prisma.stationMasterDetails.update({
            where: {
                userId: id,
            },
            data: {
                stationId,
                shift,
            },
        });
    
        return updatedStationMaster;
    }
}

module.exports = new StationMasterServices();