const prisma = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailService = require("../utils/emailService");

class StationMasterServices {
    // Generate unique employee ID
    generateEmployeeId(stationName) {
        const prefix = stationName.substring(0, 3).toUpperCase();
        const timestamp = Date.now().toString().slice(-6);
        return `${prefix}${timestamp}`;
    }

    // Generate temporary password
    generateTemporaryPassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

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
          designation = "Station Master",
          experience,
          certification,
          salary,
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

        // Get station details for employee ID generation
        const station = await prisma.station.findUnique({
            where: { id: stationId },
            select: { name: true }
        });

        if (!station) {
            throw new Error("Station not found");
        }

        // Generate employee ID and temporary password
        const employeeId = this.generateEmployeeId(station.name);
        const tempPassword = password || this.generateTemporaryPassword();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        
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
              employeeId,
              designation,
              experience: experience || 0,
              certification,
              salary,
              isActive: true,
              permissions: JSON.stringify({
                canManagePorts: true,
                canViewBookings: true,
                canConfirmBookings: true,
                canUpdatePortStatus: true,
                canViewReports: true
              })
            },
          });
    
          return { stationMaster, stationMasterAdditionalInfo };
        });

        // Send credentials email
        try {
            await emailService.sendEmployeeCredentials(email, {
                name,
                employeeId,
                password: tempPassword,
                stationName: station.name,
                designation,
                shift
            });
        } catch (emailError) {
            console.error("Failed to send credentials email:", emailError);
            // Don't fail the creation if email fails
        }
    
        return {
          stationMaster,
          stationMasterAdditionalInfo,
          employeeId,
          tempPassword: tempPassword // Return for immediate use if needed
        };
      }
      async getStationMasterById(id) {
        // Fetch the station master by ID
        const stationMaster = await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                stationMasterDetails: {
                    include: {
                        station: {
                            select: {
                                id: true,
                                name: true,
                                address: true,
                                contact: true
                            }
                        },
                        owner: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                contactNumber: true
                            }
                        }
                    }
                }
            },
        });
    
        if (!stationMaster) {
            throw new Error("Station Master not found");
        }
    
        return stationMaster;
    }

    async getAllStationMasters(ownerId, filters = {}) {
        const { stationId, isActive, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;

        const whereClause = {
            ownerId,
            ...(stationId && { stationId }),
            ...(isActive !== undefined && { isActive })
        };

        const [stationMasters, total] = await Promise.all([
            prisma.stationMasterDetails.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            contactNumber: true,
                            gender: true,
                            createdAt: true
                        }
                    },
                    station: {
                        select: {
                            id: true,
                            name: true,
                            address: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit)
            }),
            prisma.stationMasterDetails.count({ where: whereClause })
        ]);

        return {
            data: stationMasters,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
    
    async updateStationMaster(id, updatedData) {
        // Update the station master details
        const { 
            name, 
            email, 
            contactNumber, 
            gender, 
            dateOfBirth, 
            stationId, 
            shift,
            designation,
            experience,
            certification,
            salary,
            isActive,
            permissions
        } = updatedData;
    
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
        const updatedDetails = await prisma.stationMasterDetails.update({
            where: {
                userId: id,
            },
            data: {
                stationId,
                shift,
                designation,
                experience,
                certification,
                salary,
                isActive,
                permissions: permissions ? JSON.stringify(permissions) : undefined,
                updatedAt: new Date()
            },
        });
    
        return {
            user: updatedStationMaster,
            details: updatedDetails
        };
    }

    async deleteStationMaster(id, ownerId) {
        // Verify ownership
        const stationMaster = await prisma.stationMasterDetails.findUnique({
            where: { userId: id },
            include: { user: true }
        });

        if (!stationMaster || stationMaster.ownerId !== ownerId) {
            throw new Error("Station Master not found or unauthorized");
        }

        // Soft delete by deactivating
        await prisma.stationMasterDetails.update({
            where: { userId: id },
            data: { isActive: false }
        });

        return { message: "Station Master deactivated successfully" };
    }

    async getStationMastersByStation(stationId) {
        const stationMasters = await prisma.stationMasterDetails.findMany({
            where: {
                stationId,
                isActive: true
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        contactNumber: true
                    }
                }
            }
        });

        return stationMasters;
    }

    async updateStationMasterPermissions(id, permissions, ownerId) {
        // Verify ownership
        const stationMaster = await prisma.stationMasterDetails.findUnique({
            where: { userId: id }
        });

        if (!stationMaster || stationMaster.ownerId !== ownerId) {
            throw new Error("Station Master not found or unauthorized");
        }

        const updated = await prisma.stationMasterDetails.update({
            where: { userId: id },
            data: {
                permissions: JSON.stringify(permissions),
                updatedAt: new Date()
            }
        });

        return updated;
    }

    async getStationMasterDashboardData(userId) {
        const stationMaster = await prisma.stationMasterDetails.findUnique({
            where: { userId },
            include: {
                station: {
                    include: {
                        chargingSlots: true,
                        bookings: {
                            where: {
                                startTime: {
                                    gte: new Date(),
                                    lte: new Date(Date.now() + 24 * 60 * 60 * 1000) // Next 24 hours
                                }
                            },
                            include: {
                                user: {
                                    select: {
                                        name: true,
                                        contactNumber: true
                                    }
                                },
                                ev: {
                                    select: {
                                        brand: true,
                                        model: true,
                                        licensePlate: true
                                    }
                                }
                            },
                            orderBy: { startTime: 'asc' }
                        }
                    }
                }
            }
        });

        if (!stationMaster) {
            throw new Error("Station Master not found");
        }

        const station = stationMaster.station;
        const totalSlots = station.chargingSlots.length;
        const occupiedSlots = station.chargingSlots.filter(slot => slot.isOccupied).length;
        const availableSlots = totalSlots - occupiedSlots;
        const maintenanceSlots = station.chargingSlots.filter(slot => slot.status === 'MAINTENANCE').length;

        return {
            stationInfo: {
                id: station.id,
                name: station.name,
                address: station.address,
                totalSlots,
                availableSlots,
                occupiedSlots,
                maintenanceSlots
            },
            upcomingBookings: station.bookings,
            chargingSlots: station.chargingSlots,
            permissions: stationMaster.permissions ? JSON.parse(stationMaster.permissions) : {}
        };
    }
}

module.exports = new StationMasterServices();