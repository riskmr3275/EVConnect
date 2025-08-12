const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth, isOwner, isStationMaster, isUser } = require('../middlewares/Auth');

// Create a new booking
router.post('/create', auth, isUser, bookingController.createBooking);

// Get user bookings
router.get('/user-bookings', auth, isUser, bookingController.getUserBookings);

// Get booking details
router.get('/:bookingId', auth, bookingController.getBookingDetails);

// Update booking
router.put('/:bookingId', auth, isUser, bookingController.updateBooking);

// Cancel booking
router.delete('/:bookingId', auth, isUser, bookingController.cancelBooking);

// Get station bookings
router.get('/station/:stationId', auth, bookingController.getStationBookings);

// Check slot availability
router.get('/availability/check', bookingController.checkSlotAvailability);

// Get booking analytics
router.get('/analytics/data', auth, bookingController.getBookingAnalytics);

module.exports = router;