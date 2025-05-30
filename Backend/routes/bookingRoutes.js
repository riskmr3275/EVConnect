const express = require('express');
const router = express.Router();

const { auth, isOwner, isStationMaster, isUser } = require('../middlewares/Auth');
const { createBooking } = require('../controllers/bookingController');   

// Create a new booking
router.post('/createBooking', auth, isUser, createBooking);

module.exports = router;