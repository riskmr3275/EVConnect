const chargingSlotsService = require("../services/chargingSlotsServices");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class ChargingSlotsController {
  // Create a new charging slot
  async createChargingSlot(req, res) {
    try {
      const { stationId, powerLevel, type } = req.body;
      const newChargingSlot = await chargingSlotsService.createChargingSlot(
        stationId,
        powerLevel,
        type
      );
      return res
        .status(201)
        .json({ message: "Charging slot created successfully", data: newChargingSlot });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  // Get all charging slots
  async getChargingSlots(req, res) {
    try {
      const { stationId } = req.params;
      const chargingSlots = await chargingSlotsService.getChargingSlots(stationId);
      return res.status(200).json({ data: chargingSlots });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  async updateChargingSlot(req, res) {
    try {
      const { id } = req.params;
      const { powerLevel, type,isOccupied } = req.body;
      // console.log("updateChargingSlot", id, powerLevel, type, isOccupied);
      const updatedChargingSlot = await chargingSlotsService.updateChargingSlot(
        id,
        powerLevel,
        type,
        isOccupied
      );
      return res.status(200).json({ message: "Charging slot updated successfully", data: updatedChargingSlot });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new ChargingSlotsController();