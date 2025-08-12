const bookingService = require('../services/bookingService');

class BookingController {
    // Create a new booking
    async createBooking(req, res) {
        try {
            const { 
                stationId, 
                evId, 
                slotId, 
                startTime, 
                endTime, 
                estimatedCost, 
                batteryLevel, 
                portType 
            } = req.body;
            
            if (!req.user || !req.user.userId) {
                throw new Error("User not authenticated");
            }
            
            const userId = req.user.userId;
            
            const booking = await bookingService.createBooking(
                userId, 
                stationId, 
                evId, 
                slotId, 
                startTime, 
                endTime,
                {
                    estimatedCost,
                    batteryLevel,
                    portType
                }
            );
            
            res.status(201).json({
                success: true,
                message: "Booking created successfully",
                data: {
                    booking,
                    bookingId: booking.id
                }
            });
        } catch (error) {
            console.error("Error creating booking:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Get user bookings
    async getUserBookings(req, res) {
        try {
            const userId = req.user.userId;
            const { status, page = 1, limit = 10 } = req.query;
            
            const bookings = await bookingService.getUserBookings(
                userId, 
                status, 
                parseInt(page), 
                parseInt(limit)
            );
            
            res.status(200).json({
                success: true,
                bookings: bookings.data,
                pagination: bookings.pagination
            });
        } catch (error) {
            console.error("Error fetching user bookings:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Get booking details
    async getBookingDetails(req, res) {
        try {
            const { bookingId } = req.params;
            const userId = req.user.userId;
            
            const booking = await bookingService.getBookingDetails(bookingId, userId);
            
            res.status(200).json({
                success: true,
                booking
            });
        } catch (error) {
            console.error("Error fetching booking details:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Update booking
    async updateBooking(req, res) {
        try {
            const { bookingId } = req.params;
            const { startTime, endTime, slotId } = req.body;
            const userId = req.user.userId;
            
            const booking = await bookingService.updateBooking(
                bookingId, 
                userId, 
                { startTime, endTime, slotId }
            );
            
            res.status(200).json({
                success: true,
                message: "Booking updated successfully",
                booking
            });
        } catch (error) {
            console.error("Error updating booking:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Cancel booking
    async cancelBooking(req, res) {
        try {
            const { bookingId } = req.params;
            const { reason } = req.body;
            const userId = req.user.userId;
            
            const result = await bookingService.cancelBooking(bookingId, userId, reason);
            
            res.status(200).json({
                success: true,
                message: "Booking cancelled successfully",
                refundAmount: result.refundAmount
            });
        } catch (error) {
            console.error("Error cancelling booking:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Get station bookings (for station owners/masters)
    async getStationBookings(req, res) {
        try {
            const { stationId } = req.params;
            const { date, status, page = 1, limit = 20 } = req.query;
            const userId = req.user.userId;
            
            const bookings = await bookingService.getStationBookings(
                stationId, 
                userId, 
                date, 
                status, 
                parseInt(page), 
                parseInt(limit)
            );
            
            res.status(200).json({
                success: true,
                bookings: bookings.data,
                pagination: bookings.pagination
            });
        } catch (error) {
            console.error("Error fetching station bookings:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Check slot availability
    async checkSlotAvailability(req, res) {
        try {
            const { stationId, startTime, endTime, slotType } = req.query;
            
            const availability = await bookingService.checkSlotAvailability(
                stationId, 
                startTime, 
                endTime, 
                slotType
            );
            
            res.status(200).json({
                success: true,
                availability
            });
        } catch (error) {
            console.error("Error checking availability:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Get booking analytics
    async getBookingAnalytics(req, res) {
        try {
            const userId = req.user.userId;
            const { period = 'month', stationId } = req.query;
            
            const analytics = await bookingService.getBookingAnalytics(
                userId, 
                period, 
                stationId
            );
            
            res.status(200).json({
                success: true,
                analytics
            });
        } catch (error) {
            console.error("Error fetching booking analytics:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }
}

module.exports = new BookingController();