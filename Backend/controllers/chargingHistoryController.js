const chargingHistoryService = require('../services/chargingHistoryService');

class ChargingHistoryController {
    // Start charging session
    async startChargingSession(req, res) {
        try {
            const { bookingId } = req.body;
            const userId = req.user.userId;
            
            const session = await chargingHistoryService.startChargingSession(
                bookingId, 
                userId
            );
            
            res.status(200).json({
                success: true,
                message: "Charging session started",
                session
            });
        } catch (error) {
            console.error("Error starting charging session:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // End charging session
    async endChargingSession(req, res) {
        try {
            const { bookingId, energyUsed } = req.body;
            const userId = req.user.userId;
            
            const session = await chargingHistoryService.endChargingSession(
                bookingId, 
                userId, 
                energyUsed
            );
            
            res.status(200).json({
                success: true,
                message: "Charging session completed",
                session
            });
        } catch (error) {
            console.error("Error ending charging session:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Get user charging history
    async getUserChargingHistory(req, res) {
        try {
            const userId = req.user.userId;
            const { page = 1, limit = 10, startDate, endDate } = req.query;
            
            const history = await chargingHistoryService.getUserChargingHistory(
                userId, 
                parseInt(page), 
                parseInt(limit),
                startDate,
                endDate
            );
            
            res.status(200).json({
                success: true,
                history: history.data,
                pagination: history.pagination,
                summary: history.summary
            });
        } catch (error) {
            console.error("Error fetching charging history:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Get station charging analytics
    async getStationChargingAnalytics(req, res) {
        try {
            const { stationId } = req.params;
            const { startDate, endDate } = req.query;
            const userId = req.user.userId;
            
            const analytics = await chargingHistoryService.getStationChargingAnalytics(
                stationId, 
                userId,
                startDate,
                endDate
            );
            
            res.status(200).json({
                success: true,
                analytics
            });
        } catch (error) {
            console.error("Error fetching station analytics:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Get charging session details
    async getChargingSessionDetails(req, res) {
        try {
            const { sessionId } = req.params;
            const userId = req.user.userId;
            
            const session = await chargingHistoryService.getChargingSessionDetails(
                sessionId, 
                userId
            );
            
            res.status(200).json({
                success: true,
                session
            });
        } catch (error) {
            console.error("Error fetching session details:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Get energy consumption analytics
    async getEnergyConsumptionAnalytics(req, res) {
        try {
            const userId = req.user.userId;
            const { period = 'month' } = req.query; // month, week, year
            
            const analytics = await chargingHistoryService.getEnergyConsumptionAnalytics(
                userId, 
                period
            );
            
            res.status(200).json({
                success: true,
                analytics
            });
        } catch (error) {
            console.error("Error fetching energy analytics:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }
}

module.exports = new ChargingHistoryController();