const stationMasterService = require('../services/stationMasterServices');
const qrCodeService = require('../services/qrCodeService');

class StationMasterController{
    async createStationMaster(req,res){
        try{
            const {
                name,
                email,
                setPassword,
                contactNumber,
                accountType,
                gender,
                dateOfBirth,
                stationId,
                shift,
                designation,
                experience,
                certification,
                salary
            } = req.body;
            
            const stationMaster= await stationMasterService.createStationMaster({
                name,
                email,
                password:setPassword,
                contactNumber,
                accountType,
                gender,
                dateOfBirth,
                stationId,
                shift,
                designation,
                experience,
                certification,
                salary,
                user:req.user,
            })
            
            return res.status(201).json({
                message:"Station Master Created Successfully",
                data: stationMaster,
                success:true
            });
        }
        catch(error){
            return res.status(400).json({success:false,message:error.message});
        }
    }

    async getAllStationMasters(req, res) {
        try {
            const ownerId = req.user.userId;
            const filters = req.query;
            
            const result = await stationMasterService.getAllStationMasters(ownerId, filters);
            
            return res.status(200).json({
                success: true,
                message: "Station Masters retrieved successfully",
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getStationMaster(req, res) {
        try {
            const { id } = req.params;
            const stationMaster = await stationMasterService.getStationMasterById(id);
            if (!stationMaster) {
                return res.status(404).json({ 
                    success: false,
                    message: "Station Master not found" 
                });
            }
            return res.status(200).json({ 
                success: true,
                message: "Station Master retrieved successfully", 
                data: stationMaster 
            });
        } catch (error) {
            return res.status(400).json({ 
                success: false,
                message: error.message 
            });
        }
    }
    
    async updateStationMaster(req, res) {
        try {
            const { id } = req.params;
            const updatedData = req.body;
            const updatedStationMaster = await stationMasterService.updateStationMaster(id, updatedData);
            if (!updatedStationMaster) {
                return res.status(404).json({ 
                    success: false,
                    message: "Station Master not found" 
                });
            }
            return res.status(200).json({ 
                success: true,
                message: "Station Master updated successfully", 
                data: updatedStationMaster 
            });
        } catch (error) {
            return res.status(400).json({ 
                success: false,
                message: error.message 
            });
        }
    }

    async deleteStationMaster(req, res) {
        try {
            const { id } = req.params;
            const ownerId = req.user.userId;
            
            const result = await stationMasterService.deleteStationMaster(id, ownerId);
            
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

    async getStationMastersByStation(req, res) {
        try {
            const { stationId } = req.params;
            const stationMasters = await stationMasterService.getStationMastersByStation(stationId);
            
            return res.status(200).json({
                success: true,
                message: "Station Masters retrieved successfully",
                data: stationMasters
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async updatePermissions(req, res) {
        try {
            const { id } = req.params;
            const { permissions } = req.body;
            const ownerId = req.user.userId;
            
            const result = await stationMasterService.updateStationMasterPermissions(id, permissions, ownerId);
            
            return res.status(200).json({
                success: true,
                message: "Permissions updated successfully",
                data: result
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getDashboardData(req, res) {
        try {
            const userId = req.user.userId;
            const dashboardData = await stationMasterService.getStationMasterDashboardData(userId);
            
            return res.status(200).json({
                success: true,
                message: "Dashboard data retrieved successfully",
                data: dashboardData
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async scanQRCode(req, res) {
        try {
            const { qrCodeData } = req.body;
            const stationMasterId = req.user.userId;
            
            const result = await qrCodeService.verifyQRCode(qrCodeData, stationMasterId);
            
            return res.status(200).json({
                success: result.valid,
                message: result.message,
                data: result
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async confirmBooking(req, res) {
        try {
            const { bookingId } = req.params;
            const { slotId } = req.body;
            const stationMasterId = req.user.userId;
            
            const result = await qrCodeService.confirmBookingViaQR(bookingId, stationMasterId, slotId);
            
            return res.status(200).json({
                success: result.success,
                message: result.message,
                data: result.booking
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async completeCharging(req, res) {
        try {
            const { bookingId } = req.params;
            const completionData = req.body;
            const stationMasterId = req.user.userId;
            
            const result = await qrCodeService.completeChargingSession(bookingId, stationMasterId, completionData);
            
            return res.status(200).json({
                success: result.success,
                message: result.message,
                data: result.booking
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new StationMasterController();