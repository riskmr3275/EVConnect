const prisma = require("../config/database");

class BookingService {
    // Create a new booking
    async createBooking(userId, stationId, evId, slotId, startTime, endTime, additionalData = {}) {
        try {
            // Validate inputs
            if (!userId || !stationId || !slotId || !startTime || !endTime) {
                throw new Error("All booking details are required");
            }

            // Convert stationId to string if it's a number
            stationId = String(stationId);

            // If no evId provided, get user's default EV or create a temporary one
            if (!evId) {
                const userDefaultEV = await prisma.eV.findFirst({
                    where: { 
                        userId: userId,
                        isDefault: true 
                    }
                });

                if (userDefaultEV) {
                    evId = userDefaultEV.id;
                } else {
                    // Create a temporary EV for this booking
                    const tempEV = await prisma.eV.create({
                        data: {
                            userId: userId,
                            brand: "Unknown",
                            model: "Unknown",
                            licensePlate: `TEMP-${Date.now()}`,
                            batteryCapacity: 50.0, // Default capacity
                            isDefault: false
                        }
                    });
                    evId = tempEV.id;
                }
            }

            const start = new Date(startTime);
            const end = new Date(endTime);
            const now = new Date();

            // Allow bookings that start within the next 5 minutes (for immediate bookings)
            if (start < new Date(now.getTime() - 5 * 60 * 1000)) {
                throw new Error("Booking start time cannot be in the past");
            }

            if (end <= start) {
                throw new Error("End time must be after start time");
            }

            // Check if slot exists and is available
            let slot = await prisma.chargingSlot.findUnique({
                where: { id: slotId },
                include: { station: true }
            });

            if (!slot) {
                // If slot doesn't exist, create a temporary one for this booking
                const station = await prisma.station.findUnique({
                    where: { id: stationId }
                });

                if (!station) {
                    throw new Error("Station not found");
                }

                // Create a temporary slot
                slot = await prisma.chargingSlot.create({
                    data: {
                        id: slotId,
                        stationId: stationId,
                        powerLevel: 50, // Default power level
                        type: 'CCS2_DC', // Default type
                        isOccupied: false
                    }
                });
            } else if (slot.stationId !== stationId) {
                throw new Error("Slot does not belong to the specified station");
            }

            // Check for conflicting bookings
            const conflictingBooking = await prisma.booking.findFirst({
                where: {
                    slotId: slotId,
                    status: {
                        in: ['PENDING', 'CONFIRMED', 'CHARGING']
                    },
                    OR: [
                        {
                            startTime: { lte: start },
                            endTime: { gt: start }
                        },
                        {
                            startTime: { lt: end },
                            endTime: { gte: end }
                        },
                        {
                            startTime: { gte: start },
                            endTime: { lte: end }
                        }
                    ]
                }
            });

            if (conflictingBooking) {
                throw new Error("Slot is not available for the selected time");
            }

            // Verify EV belongs to user
            const ev = await prisma.eV.findUnique({
                where: { id: evId }
            });

            if (!ev || ev.userId !== userId) {
                throw new Error("EV not found or does not belong to user");
            }

            // Create the booking (only with fields that exist in schema)
            const booking = await prisma.booking.create({
                data: {
                    userId,
                    stationId,
                    evId,
                    slotId,
                    startTime: start,
                    endTime: end,
                    status: 'PENDING'
                },
                include: {
                    station: {
                        select: {
                            name: true,
                            address: true
                        }
                    },
                    ev: {
                        select: {
                            brand: true,
                            model: true,
                            licensePlate: true
                        }
                    },
                    slot: {
                        select: {
                            type: true,
                            powerLevel: true
                        }
                    }
                }
            });

            // Update station available slots
            await prisma.station.update({
                where: { id: stationId },
                data: {
                    availableSlots: {
                        decrement: 1
                    }
                }
            });

            // Create notification
            await prisma.notification.create({
                data: {
                    userId: userId,
                    message: `Booking created for ${booking.station.name}. Please complete payment to confirm.`,
                    type: 'BOOKING_CONFIRMATION'
                }
            });

            return booking;
        } catch (error) {
            console.error("Error creating booking:", error);
            throw new Error(error.message || "Failed to create booking");
        }
    }

    // Get user bookings with pagination
    async getUserBookings(userId, status, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            
            // Handle multiple status values
            let statusFilter = {};
            if (status) {
                if (status.includes(',')) {
                    // Multiple statuses separated by comma
                    const statusArray = status.split(',').map(s => s.trim());
                    statusFilter = { status: { in: statusArray } };
                } else {
                    // Single status
                    statusFilter = { status };
                }
            }
            
            const whereClause = {
                userId,
                ...statusFilter
            };

            const [bookings, total] = await Promise.all([
                prisma.booking.findMany({
                    where: whereClause,
                    include: {
                        station: {
                            select: {
                                name: true,
                                address: true,
                                latitude: true,
                                longitude: true
                            }
                        },
                        ev: {
                            select: {
                                brand: true,
                                model: true,
                                licensePlate: true
                            }
                        },
                        slot: {
                            select: {
                                type: true,
                                powerLevel: true
                            }
                        },
                        transaction: {
                            select: {
                                amount: true,
                                status: true,
                                type: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: limit
                }),
                prisma.booking.count({ where: whereClause })
            ]);

            return {
                data: bookings,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error("Error fetching user bookings:", error);
            throw new Error("Failed to fetch bookings");
        }
    }

    // Get booking details
    async getBookingDetails(bookingId, userId) {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    station: {
                        include: {
                            owner: {
                                select: {
                                    name: true,
                                    contactNumber: true
                                }
                            }
                        }
                    },
                    ev: true,
                    slot: true,
                    transaction: true,
                    chargingHistory: true
                }
            });

            if (!booking) {
                throw new Error("Booking not found");
            }

            // Check if user has access (booking owner or station owner)
            const hasAccess = booking.userId === userId || booking.station.ownerId === userId;
            if (!hasAccess) {
                throw new Error("Unauthorized access to booking");
            }

            return booking;
        } catch (error) {
            console.error("Error fetching booking details:", error);
            throw new Error("Failed to fetch booking details");
        }
    }

    // Update booking
    async updateBooking(bookingId, userId, updateData) {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId }
            });

            if (!booking || booking.userId !== userId) {
                throw new Error("Booking not found or unauthorized");
            }

            if (booking.status !== 'PENDING') {
                throw new Error("Only pending bookings can be modified");
            }

            // If updating time slots, check availability
            if (updateData.startTime || updateData.endTime || updateData.slotId) {
                const newStartTime = updateData.startTime ? new Date(updateData.startTime) : booking.startTime;
                const newEndTime = updateData.endTime ? new Date(updateData.endTime) : booking.endTime;
                const newSlotId = updateData.slotId || booking.slotId;

                // Check for conflicts (excluding current booking)
                const conflictingBooking = await prisma.booking.findFirst({
                    where: {
                        slotId: newSlotId,
                        id: { not: bookingId },
                        status: {
                            in: ['PENDING', 'CONFIRMED', 'CHARGING']
                        },
                        OR: [
                            {
                                startTime: { lte: newStartTime },
                                endTime: { gt: newStartTime }
                            },
                            {
                                startTime: { lt: newEndTime },
                                endTime: { gte: newEndTime }
                            },
                            {
                                startTime: { gte: newStartTime },
                                endTime: { lte: newEndTime }
                            }
                        ]
                    }
                });

                if (conflictingBooking) {
                    throw new Error("Slot is not available for the selected time");
                }
            }

            const updatedBooking = await prisma.booking.update({
                where: { id: bookingId },
                data: updateData,
                include: {
                    station: true,
                    ev: true,
                    slot: true
                }
            });

            // Create notification
            await prisma.notification.create({
                data: {
                    userId: userId,
                    message: `Booking updated for ${updatedBooking.station.name}`,
                    type: 'BOOKING_CONFIRMATION'
                }
            });

            return updatedBooking;
        } catch (error) {
            console.error("Error updating booking:", error);
            throw new Error(error.message || "Failed to update booking");
        }
    }

    // Cancel booking
    async cancelBooking(bookingId, userId, reason) {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    transaction: true,
                    station: true
                }
            });

            if (!booking || booking.userId !== userId) {
                throw new Error("Booking not found or unauthorized");
            }

            if (booking.status === 'CANCELLED') {
                throw new Error("Booking is already cancelled");
            }

            if (booking.status === 'CHARGING_DONE') {
                throw new Error("Cannot cancel completed booking");
            }

            // Calculate refund amount
            let refundAmount = 0;
            if (booking.transaction && booking.transaction.status === 'COMPLETED') {
                refundAmount = this.calculateRefundAmount(booking);
            }

            // Update booking status
            await prisma.booking.update({
                where: { id: bookingId },
                data: { status: 'CANCELLED' }
            });

            // Free up the slot and update station availability
            await prisma.station.update({
                where: { id: booking.stationId },
                data: {
                    availableSlots: {
                        increment: 1
                    }
                }
            });

            // Process refund if applicable
            if (refundAmount > 0) {
                await prisma.transaction.create({
                    data: {
                        userId: userId,
                        bookingId: bookingId,
                        amount: refundAmount,
                        type: 'REFUND',
                        status: 'COMPLETED'
                    }
                });
            }

            // Create notification
            await prisma.notification.create({
                data: {
                    userId: userId,
                    message: `Booking cancelled for ${booking.station.name}. ${refundAmount > 0 ? `Refund of ₹${refundAmount} processed.` : ''}`,
                    type: 'BOOKING_CANCELLATION'
                }
            });

            return { refundAmount };
        } catch (error) {
            console.error("Error cancelling booking:", error);
            throw new Error(error.message || "Failed to cancel booking");
        }
    }

    // Get station bookings
    async getStationBookings(stationId, userId, date, status, page = 1, limit = 20) {
        try {
            // Verify user owns the station or is a station master
            const station = await prisma.station.findUnique({
                where: { id: stationId },
                include: {
                    stationMasters: {
                        where: { userId }
                    }
                }
            });

            if (!station) {
                throw new Error("Station not found");
            }

            const hasAccess = station.ownerId === userId || station.stationMasters.length > 0;
            if (!hasAccess) {
                throw new Error("Unauthorized access to station bookings");
            }

            const skip = (page - 1) * limit;
            
            const whereClause = {
                stationId,
                ...(status && { status }),
                ...(date && {
                    startTime: {
                        gte: new Date(date),
                        lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
                    }
                })
            };

            const [bookings, total] = await Promise.all([
                prisma.booking.findMany({
                    where: whereClause,
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                contactNumber: true
                            }
                        },
                        ev: {
                            select: {
                                brand: true,
                                model: true,
                                licensePlate: true
                            }
                        },
                        slot: {
                            select: {
                                type: true,
                                powerLevel: true
                            }
                        },
                        transaction: {
                            select: {
                                amount: true,
                                status: true
                            }
                        }
                    },
                    orderBy: { startTime: 'asc' },
                    skip,
                    take: limit
                }),
                prisma.booking.count({ where: whereClause })
            ]);

            return {
                data: bookings,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error("Error fetching station bookings:", error);
            throw new Error("Failed to fetch station bookings");
        }
    }

    // Check slot availability
    async checkSlotAvailability(stationId, startTime, endTime, slotType) {
        try {
            const start = new Date(startTime);
            const end = new Date(endTime);

            // Get all slots of the specified type at the station
            const slots = await prisma.chargingSlot.findMany({
                where: {
                    stationId,
                    ...(slotType && { type: slotType })
                }
            });

            const availableSlots = [];

            for (const slot of slots) {
                // Check if slot has conflicting bookings
                const conflictingBooking = await prisma.booking.findFirst({
                    where: {
                        slotId: slot.id,
                        status: {
                            in: ['PENDING', 'CONFIRMED', 'CHARGING']
                        },
                        OR: [
                            {
                                startTime: { lte: start },
                                endTime: { gt: start }
                            },
                            {
                                startTime: { lt: end },
                                endTime: { gte: end }
                            },
                            {
                                startTime: { gte: start },
                                endTime: { lte: end }
                            }
                        ]
                    }
                });

                if (!conflictingBooking) {
                    availableSlots.push(slot);
                }
            }

            return {
                totalSlots: slots.length,
                availableSlots: availableSlots.length,
                slots: availableSlots
            };
        } catch (error) {
            console.error("Error checking availability:", error);
            throw new Error("Failed to check slot availability");
        }
    }

    // Get booking analytics
    async getBookingAnalytics(userId, period, stationId) {
        try {
            let dateFilter = {};
            const now = new Date();

            switch (period) {
                case 'week':
                    dateFilter.gte = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    dateFilter.gte = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                case 'year':
                    dateFilter.gte = new Date(now.getFullYear(), 0, 1);
                    break;
            }

            const whereClause = {
                ...(stationId ? { stationId } : { userId }),
                createdAt: dateFilter
            };

            const bookings = await prisma.booking.findMany({
                where: whereClause,
                include: {
                    transaction: true,
                    station: {
                        select: { name: true }
                    }
                }
            });

            const analytics = {
                totalBookings: bookings.length,
                confirmedBookings: 0,
                cancelledBookings: 0,
                completedBookings: 0,
                totalRevenue: 0,
                averageBookingValue: 0,
                bookingsByStatus: {},
                dailyBookings: {},
                stationWiseBookings: {}
            };

            bookings.forEach(booking => {
                // Status counts
                analytics.bookingsByStatus[booking.status] = 
                    (analytics.bookingsByStatus[booking.status] || 0) + 1;

                if (booking.status === 'CONFIRMED') analytics.confirmedBookings++;
                if (booking.status === 'CANCELLED') analytics.cancelledBookings++;
                if (booking.status === 'CHARGING_DONE') analytics.completedBookings++;

                // Revenue calculation
                if (booking.transaction && booking.transaction.status === 'COMPLETED') {
                    analytics.totalRevenue += booking.transaction.amount;
                }

                // Daily bookings
                const date = booking.createdAt.toISOString().split('T')[0];
                analytics.dailyBookings[date] = (analytics.dailyBookings[date] || 0) + 1;

                // Station wise bookings
                const stationName = booking.station.name;
                analytics.stationWiseBookings[stationName] = 
                    (analytics.stationWiseBookings[stationName] || 0) + 1;
            });

            if (analytics.confirmedBookings > 0) {
                analytics.averageBookingValue = Math.round((analytics.totalRevenue / analytics.confirmedBookings) * 100) / 100;
            }

            return analytics;
        } catch (error) {
            console.error("Error fetching booking analytics:", error);
            throw new Error("Failed to fetch booking analytics");
        }
    }

    // Helper method to calculate refund amount
    calculateRefundAmount(booking) {
        const now = new Date();
        const startTime = new Date(booking.startTime);
        const hoursUntilStart = (startTime - now) / (1000 * 60 * 60);

        // Refund policy
        if (hoursUntilStart >= 24) {
            return booking.transaction?.amount || 0;
        } else if (hoursUntilStart >= 2) {
            return (booking.transaction?.amount || 0) * 0.5;
        } else {
            return 0;
        }
    }
}

module.exports = new BookingService();