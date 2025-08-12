const express = require('express');
const router = express.Router();
const qrCodeController = require('../controllers/qrCodeController');
const { auth } = require('../middlewares/Auth');

// Generate QR code for booking
router.get('/booking/:bookingId', auth, qrCodeController.generateBookingQRCode);

// Generate QR code for station
router.get('/station/:stationId', auth, qrCodeController.generateStationQRCode);

// Verify QR code
router.post('/verify', auth, qrCodeController.verifyQRCode);

// Generate charging session QR code
router.post('/charging-session/:bookingId', auth, qrCodeController.generateChargingSessionQRCode);

module.exports = router;