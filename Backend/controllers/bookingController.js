const bookingService = require('../services/bookingService');

class BookingController {
    async createBooking(req, res) {
        try {
            const { userId, slotId, startTime, endTime } = req.body;
            // the isssue is that the slotId is not part of the booking table and the schmea have to change to add that
            const booking = await bookingService.createBooking(userId, slotId, startTime, endTime);
            res.status(201).json(booking);
        } catch (error) {
            console.error("Error creating booking:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = new BookingController();