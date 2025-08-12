const prisma = require("../config/database");

class ChargingSlotsService {
  // Generate slot number based on station and existing slots
  async generateSlotNumber(stationId) {
    const existingSlots = await prisma.chargingSlot.count({
      where: { stationId }
    });
    
    const slotNumber = `A${(existingSlots + 1).toString().padStart(2, '0')}`;
    return slotNumber;
  }

  async createChargingSlot(data) {
    const { stationId, powerLevel, type, pricePerKwh, slotNumber } = data;
    
    // Verify station exists and user has permission
    const station = await prisma.station.findUnique({
      where: { id: stationId }
    });

    if (!station) {
      throw new Error("Station not found");
    }

    // Generate slot number if not provided
    const finalSlotNumber = slotNumber || await this.generateSlotNumber(stationId);

    // Check if slot number already exists for this station
    const existingSlot = await prisma.chargingSlot.findUnique({
      where: {
        stationId_slotNumber: {
          stationId,
          slotNumber: finalSlotNumber
        }
      }
    });

    if (existingSlot) {
      throw new Error(`Slot number ${finalSlotNumber} already exists for this station`);
    }

    const newSlot = await prisma.chargingSlot.create({
      data: {
        stationId: stationId,
        slotNumber: finalSlotNumber,
        powerLevel: Number(powerLevel),
        type: type,
        pricePerKwh: pricePerKwh || 8.0,
        isOccupied: false,
        isActive: true,
        status: 'AVAILABLE'
      },
    });

    // Update station total slots count
    await prisma.station.update({
      where: { id: stationId },
      data: {
        totalSlots: {
          increment: 1
        },
        availableSlots: {
          increment: 1
        }
      }
    });

    return newSlot;
  }

  async getChargingSlots(stationId, filters = {}) {
    const { status, type, isActive } = filters;
    
    const whereClause = {
      stationId,
      ...(status && { status }),
      ...(type && { type }),
      ...(isActive !== undefined && { isActive })
    };

    return await prisma.chargingSlot.findMany({
      where: whereClause,
      orderBy: [
        { slotNumber: 'asc' }
      ]
    });
  }

  async getAvailableSlots(stationId, slotType = null) {
    const whereClause = {
      stationId,
      isOccupied: false,
      isActive: true,
      status: 'AVAILABLE',
      ...(slotType && { type: slotType })
    };

    return await prisma.chargingSlot.findMany({
      where: whereClause,
      orderBy: [
        { powerLevel: 'desc' }, // Higher power slots first
        { slotNumber: 'asc' }
      ]
    });
  }

  async getSlotById(slotId) {
    return await prisma.chargingSlot.findUnique({
      where: { id: slotId },
      include: {
        station: {
          select: {
            name: true,
            address: true
          }
        },
        bookings: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED', 'CHARGING']
            }
          },
          include: {
            user: {
              select: {
                name: true,
                contactNumber: true
              }
            }
          },
          orderBy: { startTime: 'asc' }
        }
      }
    });
  }

  async updateChargingSlot(id, updateData) {
    const slot = await prisma.chargingSlot.findUnique({
      where: { id },
    });
    
    if (!slot) {
      throw new Error("Charging slot not found");
    }

    const {
      powerLevel,
      type,
      isOccupied,
      isActive,
      status,
      pricePerKwh,
      slotNumber,
      lastMaintenance
    } = updateData;

    const finalUpdateData = {};
    
    if (powerLevel !== undefined) finalUpdateData.powerLevel = Number(powerLevel);
    if (type !== undefined) finalUpdateData.type = type;
    if (pricePerKwh !== undefined) finalUpdateData.pricePerKwh = Number(pricePerKwh);
    if (slotNumber !== undefined) finalUpdateData.slotNumber = slotNumber;
    if (lastMaintenance !== undefined) finalUpdateData.lastMaintenance = new Date(lastMaintenance);
    
    if (isOccupied !== undefined) {
      finalUpdateData.isOccupied = (isOccupied === 'true' || isOccupied === true || isOccupied === 'True' || isOccupied === 'TRUE') ? true : false;
    }
    
    if (isActive !== undefined) {
      finalUpdateData.isActive = (isActive === 'true' || isActive === true || isActive === 'True' || isActive === 'TRUE') ? true : false;
    }
    
    if (status !== undefined) {
      finalUpdateData.status = status;
      
      // Auto-update isOccupied based on status
      if (status === 'OCCUPIED') {
        finalUpdateData.isOccupied = true;
      } else if (status === 'AVAILABLE') {
        finalUpdateData.isOccupied = false;
      }
    }

    const updatedSlot = await prisma.chargingSlot.update({
      where: { id },
      data: {
        ...finalUpdateData,
        updatedAt: new Date()
      },
    });

    // Update station available slots count if occupation status changed
    if (finalUpdateData.isOccupied !== undefined) {
      const increment = finalUpdateData.isOccupied ? -1 : 1;
      await prisma.station.update({
        where: { id: slot.stationId },
        data: {
          availableSlots: {
            increment: increment
          }
        }
      });
    }

    return updatedSlot;
  }

  async deleteChargingSlot(id, stationId) {
    const slot = await prisma.chargingSlot.findUnique({
      where: { id },
      include: {
        bookings: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED', 'CHARGING']
            }
          }
        }
      }
    });

    if (!slot) {
      throw new Error("Charging slot not found");
    }

    if (slot.stationId !== stationId) {
      throw new Error("Slot does not belong to this station");
    }

    if (slot.bookings.length > 0) {
      throw new Error("Cannot delete slot with active bookings");
    }

    await prisma.chargingSlot.delete({
      where: { id }
    });

    // Update station slots count
    await prisma.station.update({
      where: { id: stationId },
      data: {
        totalSlots: {
          decrement: 1
        },
        ...(slot.isOccupied ? {} : {
          availableSlots: {
            decrement: 1
          }
        })
      }
    });

    return { message: "Charging slot deleted successfully" };
  }

  async updateSlotStatus(id, status, stationMasterId) {
    const slot = await prisma.chargingSlot.findUnique({
      where: { id },
      include: {
        station: {
          include: {
            stationMasters: {
              where: { userId: stationMasterId }
            }
          }
        }
      }
    });

    if (!slot) {
      throw new Error("Charging slot not found");
    }

    // Verify station master has access
    if (slot.station.stationMasters.length === 0) {
      throw new Error("Unauthorized: You do not have access to this station");
    }

    const validStatuses = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'OUT_OF_ORDER'];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status");
    }

    const updateData = {
      status,
      updatedAt: new Date()
    };

    // Update occupation based on status
    if (status === 'OCCUPIED') {
      updateData.isOccupied = true;
    } else if (status === 'AVAILABLE') {
      updateData.isOccupied = false;
    }

    // Set maintenance timestamp
    if (status === 'MAINTENANCE') {
      updateData.lastMaintenance = new Date();
    }

    const updatedSlot = await prisma.chargingSlot.update({
      where: { id },
      data: updateData
    });

    // Update station available slots count
    const availableSlots = await prisma.chargingSlot.count({
      where: {
        stationId: slot.stationId,
        isOccupied: false,
        isActive: true,
        status: 'AVAILABLE'
      }
    });

    await prisma.station.update({
      where: { id: slot.stationId },
      data: { availableSlots }
    });

    return updatedSlot;
  }

  async getSlotAnalytics(stationId, period = 'month') {
    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case 'week':
        dateFilter.gte = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        dateFilter.gte = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        dateFilter.gte = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const [slots, bookings] = await Promise.all([
      prisma.chargingSlot.findMany({
        where: { stationId },
        include: {
          _count: {
            select: {
              bookings: {
                where: {
                  createdAt: dateFilter,
                  status: 'CHARGING_DONE'
                }
              }
            }
          }
        }
      }),
      prisma.booking.findMany({
        where: {
          stationId,
          createdAt: dateFilter,
          status: 'CHARGING_DONE'
        },
        include: {
          slot: {
            select: {
              slotNumber: true,
              type: true
            }
          }
        }
      })
    ]);

    const analytics = {
      totalSlots: slots.length,
      availableSlots: slots.filter(s => s.status === 'AVAILABLE').length,
      occupiedSlots: slots.filter(s => s.status === 'OCCUPIED').length,
      maintenanceSlots: slots.filter(s => s.status === 'MAINTENANCE').length,
      outOfOrderSlots: slots.filter(s => s.status === 'OUT_OF_ORDER').length,
      totalBookings: bookings.length,
      slotUtilization: {},
      typeDistribution: {},
      powerLevelDistribution: {}
    };

    // Calculate slot utilization
    slots.forEach(slot => {
      analytics.slotUtilization[slot.slotNumber] = slot._count.bookings;
      
      // Type distribution
      analytics.typeDistribution[slot.type] = 
        (analytics.typeDistribution[slot.type] || 0) + 1;
      
      // Power level distribution
      const powerRange = `${slot.powerLevel}kW`;
      analytics.powerLevelDistribution[powerRange] = 
        (analytics.powerLevelDistribution[powerRange] || 0) + 1;
    });

    return analytics;
  }
}

module.exports = new ChargingSlotsService();
