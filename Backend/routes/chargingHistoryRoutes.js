const express = require('express');
const router = express.Router();
const chargingHistoryController = require('../controllers/chargingHistoryController');
const { auth } = require('../middlewares/Auth');

// Start charging session
router.post('/start-session', auth, chargingHistoryController.startChargingSession);

// End charging session
router.post('/end-session', auth, chargingHistoryController.endChargingSession);

// Get user charging history
router.get('/user-history', auth, chargingHistoryController.getUserChargingHistory);

// Get station charging analytics
router.get('/station-analytics/:stationId', auth, chargingHistoryController.getStationChargingAnalytics);

// Get charging session details
router.get('/session/:sessionId', auth, chargingHistoryController.getChargingSessionDetails);

// Get energy consumption analytics
router.get('/energy-analytics', auth, chargingHistoryController.getEnergyConsumptionAnalytics);

module.exports = router;