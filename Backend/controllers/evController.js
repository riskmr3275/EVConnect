const evService = require("../services/evService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class EVController {
    // Create a new EV
    async createEV(req, res) {
        try {
            
            const {  brand, model, licensePlate, batteryCapacity, preferredAcPort,preferredDcPort, isDefault } = req.body;

            const newEV = await evService.createEV({
                brand,
                model,
                licensePlate,
                batteryCapacity,
                preferredAcPort,
                preferredDcPort,
                user:req.user,
            });

            return res.status(201).json({ message: 'EV created successfully', data: newEV });
        } catch (error) {
            return res.status(400).json({ success1: false, message: error.message });
        }
    }

    // Get all EVs
    async getEV(req, res) {
        try {
            const userId = req.user.userId; // Assuming user ID is attached to the request
            const evs = await evService.getEV(userId);

            return res.status(200).json({ message: 'EVs retrieved successfully', data: evs });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    // Get EV by ID
    async getEVById(req, res) {
        try {
            const { id } = req.params;
            const ev = await evService.getEVById(id);

            if (!ev) {
                return res.status(404).json({ success: false, message: 'EV not found' });
            }

            return res.status(200).json({ message: 'EV retrieved successfully', data: ev });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    // Update EV by ID
    async updateEV(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const updatedEV = await evService.updateEV(id, updateData);

            if (!updatedEV) {
                return res.status(404).json({ success: false, message: 'EV not found' });
            }

            return res.status(200).json({ message: 'EV updated successfully', data: updatedEV });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    // Delete EV by ID
    async deleteEV(req, res) {
        try {
            const { id } = req.params;

            const deletedEV = await evService.deleteEV(id);

            if (!deletedEV) {
                return res.status(404).json({ success: false, message: 'EV not found' });
            }

            return res.status(200).json({ message: 'EV deleted successfully' });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new EVController();
