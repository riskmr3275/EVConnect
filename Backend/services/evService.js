const  prisma  = require("../config/database");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const evService = {
    // Create a new EV
    async createEV(data) {
        try {
            console.log("Creating EV with data:", data);
            const newEV = await prisma.EV.create({
                data: {
                    userId: data.user.userId,
                    brand: data.brand,
                    model: data.model,
                    licensePlate: data.licensePlate,
                    batteryCapacity: data.batteryCapacity,
                    preferredAcPort: data.preferredAcPort || null,
                    preferredDcPort: data.preferredDcPort || null,
                    isDefault: data.isDefault || true,
                },
            });
            return newEV;
        } catch (error) {
            throw new Error('Error creating EV: ' + error.message)
        }
    },

    // Get all EVs for a user
    async getEV(userId) {
        try {
            const evs = await prisma.EV.findMany({
                where: { userId },
            });
            return evs;
        } catch (error) {
            throw new Error('Error retrieving EVs: ' + error.message);
        }
    },

    // Get EV by ID
    async getEVById(id) {
        try {
            const ev = await prisma.EV.findUnique({
                where: { id },
            });
            return ev;
        } catch (error) {
            throw new Error('Error retrieving EV: ' + error.message);
        }
    },

    // Update EV by ID
    async updateEV(id, updateData) {
        try {
            const updatedEV = await prisma.EV.update({
                where: { id },
                data: updateData,
            });
            return updatedEV;
        } catch (error) {
            throw new Error('Error updating EV: ' + error.message);
        }
    },

    // Delete EV by ID
    async deleteEV(id) {
        try {
            const deletedEV = await prisma.EV.delete({
                where: { id },
            });
            return deletedEV;
        } catch (error) {
            throw new Error('Error deleting EV: ' + error.message);
        }
    },
};

module.exports = evService;