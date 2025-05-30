const prisma = require("../config/database");

class ChargingSlotsService {
  async createChargingSlot(stationId, powerLevel, type) {
    // console.log("dafsd", stationId, powerLevel, type);
    const newSlot = await prisma.chargingSlot.create({
      data: {
        stationId: stationId, // UUID of the station
        powerLevel: Number(powerLevel), // convert string to number if needed
        type: type, // e.g., "BHARAT_AC_001"
      },
    });

    return newSlot;
  }

  async getChargingSlots(stationId) {
    return await prisma.chargingSlot.findMany({
      where: {
        stationId,
        // isOccupied: false,
      },
    });
  }

  async updateChargingSlot(id, powerLevel, type,isOccupied) {
    const slot = await prisma.chargingSlot.findUnique({
      where: { id },
    });
    if (!slot) {
      throw new Error("Charging slot not found");
    }
    const updateData = {};
    if (powerLevel !== undefined) updateData.powerLevel = Number(powerLevel);
    if (type !== undefined) updateData.type = type;
    if (isOccupied !== undefined) updateData.isOccupied = (isOccupied === 'true' || isOccupied === true || isOccupied==='True'|| isOccupied==='TRUE')? true : false;
    // console.log("updateData", updateData);
    return await prisma.chargingSlot.update({
      where: { id },
      data: updateData,
    });
  }
}

module.exports = new ChargingSlotsService();
