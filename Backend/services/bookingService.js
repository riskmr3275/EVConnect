const prisma = require("../config/database");


class BookingService {
    async createBooking(userId, slotId, startTime, endTime) {
        // console.log("dafsd", stationId, powerLevel, type);
        const newBooking = await prisma.booking.create({
            data: {
                userId: userId, // UUID of the station
                slotId: slotId, // convert string to number if needed
                startTime: startTime,
                endTime: endTime,
            },
        });

        return newBooking;
    }
}

module.exports = new BookingService();