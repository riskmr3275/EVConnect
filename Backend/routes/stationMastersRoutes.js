const express = require("express");
const router = express.Router();

const { 
    createStationMaster, 
    getStationMaster,
    getAllStationMasters,
    updateStationMaster,
    deleteStationMaster,
    getStationMastersByStation,
    updatePermissions,
    getDashboardData,
    scanQRCode,
    confirmBooking,
    completeCharging
} = require('../controllers/stationMastersController');
const { auth, isOwner, isStationMaster } = require('../middlewares/Auth');

// Owner routes for managing station masters
router.post('/create', auth, isOwner, createStationMaster);
router.get('/all', auth, isOwner, getAllStationMasters);
router.get('/:id', auth, getStationMaster);
router.put('/:id', auth, isOwner, updateStationMaster);
router.delete('/:id', auth, isOwner, deleteStationMaster);
router.get('/station/:stationId', auth, isOwner, getStationMastersByStation);
router.put('/:id/permissions', auth, isOwner, updatePermissions);

// Station Master specific routes
router.get('/dashboard/data', auth, isStationMaster, getDashboardData);
router.post('/qr/scan', auth, isStationMaster, scanQRCode);
router.post('/booking/:bookingId/confirm', auth, isStationMaster, confirmBooking);
router.post('/booking/:bookingId/complete', auth, isStationMaster, completeCharging);

// Legacy routes for backward compatibility
router.post('/addStationMaster', auth, isOwner, createStationMaster);
router.get('/getStationMaster/:id', getStationMaster);
router.post('/updateStationMaster/:id', auth, isStationMaster, updateStationMaster);

module.exports = router;