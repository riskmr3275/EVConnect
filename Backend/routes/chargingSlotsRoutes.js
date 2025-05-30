const express = require('express');
const router = express.Router();

// getChargingSlots, getChargingSlotById, updateChargingSlot, deleteChargingSlot
const { createChargingSlot,getChargingSlots,updateChargingSlot  } = require('../controllers/chargingSlotsController');
const { auth, isOwner, isStationMaster, isUser } = require('../middlewares/Auth');

// Create a new charging slot
router.post('/addChargingSlot', auth, isOwner, createChargingSlot);
router.get('/getChargingSlots/:stationId', getChargingSlots);
// router.get('/getChargingSlotById/:id', auth, isOwner, getChargingSlotById); 
router.post('/updateChargingSlot/:id', auth, isStationMaster, updateChargingSlot);
// router.delete('/deleteChargingSlot/:id', auth, isOwner, deleteChargingSlot);

module.exports = router;