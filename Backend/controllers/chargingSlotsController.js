const chargingSlotsService = require("../services/chargingSlotsServices");

class ChargingSlotsController {
  // Create a new charging slot
  async createChargingSlot(req, res) {
    try {
      const { stationId, powerLevel, type, pricePerKwh, slotNumber } = req.body;
      
      const newChargingSlot = await chargingSlotsService.createChargingSlot({
        stationId,
        powerLevel,
        type,
        pricePerKwh,
        slotNumber
      });
      
      return res.status(201).json({ 
        success: true,
        message: "Charging slot created successfully", 
        data: newChargingSlot 
      });
    } catch (error) {
      return res.status(400).json({ 
        success: false,
        message: error.message 
      });
    }
  }
  // Get all charging slots
  async getChargingSlots(req, res) {
    try {
      const { stationId } = req.params;
      const filters = req.query;
      
      const chargingSlots = await chargingSlotsService.getChargingSlots(stationId, filters);
      
      return res.status(200).json({ 
        success: true,
        message: "Charging slots retrieved successfully",
        data: chargingSlots 
      });
    } catch (error) {
      return res.status(400).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Get available charging slots
  async getAvailableSlots(req, res) {
    try {
      const { stationId } = req.params;
      const { slotType } = req.query;
      
      const availableSlots = await chargingSlotsService.getAvailableSlots(stationId, slotType);
      
      return res.status(200).json({
        success: true,
        message: "Available slots retrieved successfully",
        data: availableSlots
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get slot by ID
  async getSlotById(req, res) {
    try {
      const { id } = req.params;
      
      const slot = await chargingSlotsService.getSlotById(id);
      
      if (!slot) {
        return res.status(404).json({
          success: false,
          message: "Charging slot not found"
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "Slot details retrieved successfully",
        data: slot
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async updateChargingSlot(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedChargingSlot = await chargingSlotsService.updateChargingSlot(id, updateData);
      
      return res.status(200).json({ 
        success: true,
        message: "Charging slot updated successfully", 
        data: updatedChargingSlot 
      });
    } catch (error) {
      return res.status(400).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  async deleteChargingSlot(req, res) {
    try {
      const { id } = req.params;
      const { stationId } = req.body;
      
      const result = await chargingSlotsService.deleteChargingSlot(id, stationId);
      
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Station Master specific methods
  async updateSlotStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const stationMasterId = req.user.userId;
      
      const updatedSlot = await chargingSlotsService.updateSlotStatus(id, status, stationMasterId);
      
      return res.status(200).json({
        success: true,
        message: "Slot status updated successfully",
        data: updatedSlot
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getSlotAnalytics(req, res) {
    try {
      const { stationId } = req.params;
      const { period } = req.query;
      
      const analytics = await chargingSlotsService.getSlotAnalytics(stationId, period);
      
      return res.status(200).json({
        success: true,
        message: "Slot analytics retrieved successfully",
        data: analytics
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ChargingSlotsController();