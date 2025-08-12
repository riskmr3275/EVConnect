const express = require('express');
const router = express.Router();

const { 
    createChargingSlot,
    getChargingSlots,
    getAvailableSlots,
    getSlotById,
    updateChargingSlot,
    deleteChargingSlot,
    updateSlotStatus,
    getSlotAnalytics
} = require('../controllers/chargingSlotsController');
const { auth, isOwner, isStationMaster, isUser } = require('../middlewares/Auth');

// Owner routes for managing charging slots
router.post('/create', auth, isOwner, createChargingSlot);
router.get('/station/:stationId', getChargingSlots);
router.get('/station/:stationId/available', getAvailableSlots);
router.get('/:id', getSlotById);
router.put('/:id', auth, isOwner, updateChargingSlot);
router.delete('/:id', auth, isOwner, deleteChargingSlot);
router.get('/station/:stationId/analytics', auth, isOwner, getSlotAnalytics);

// Station Master routes for managing slot status
router.put('/:id/status', auth, isStationMaster, updateSlotStatus);

// Legacy routes for backward compatibility
router.post('/addChargingSlot', auth, isOwner, createChargingSlot);
router.get('/getChargingSlots/:stationId', getChargingSlots);
router.post('/updateChargingSlot/:id', auth, isStationMaster, updateChargingSlot);

module.exports = router;