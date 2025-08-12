const prisma = require("../config/database");

class ChargingHistoryService {
    // Start charging session
    async startChargingSession(bookingId, userId) {
        try {  
            // Verify booking exists and belongs to user
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    station: true,
                    ev: true,
                    slot: true
                }
            });

            if (!booking) {
                throw new Error("Booking not found");
            }

            if (booking.userId !== userId) {
                throw new Error("Unauthorized access to booking");
            }

            if (booking.status !== 'CONFIRMED') {
                throw new Error("Booking must be confirmed to start charging");
            }

            // Update booking status to CHARGING
            await prisma.booking.update({
                where: { id: bookingId },
                data: { status: 'CHARGING' }
            });

            // Update slot to occupied
            await prisma.chargingSlot.update({
                where: { id: booking.slotId },
                data: { isOccupied: true }
            });

            // Create charging history record
            const chargingHistory = await prisma.chargingHistory.create({
                data: {
                    userId: userId,
                    stationId: booking.stationId,
                    bookingId: bookingId,
                    evId: booking.evId,
                    energyUsed: 0,
                    cost: 0,
                    duration: 0
                }
            });

            // Create notification
            await prisma.notification.create({
                data: {
                    userId: userId,
                    message: `Charging session started at ${booking.station.name}`,
                    type: 'BOOKING_CONFIRMATION'
                }
            });

            return chargingHistory;
        } catch (error) {
            console.error("Error starting charging session:", error);
            throw new Error("Failed to start charging session");
        }
    }

    // End charging session
    async endChargingSession(bookingId, userId, energyUsed) {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    station: true,
                    chargingHistory: true,
                    slot: true
                }
            });

            if (!booking || booking.userId !== userId) {
                throw new Error("Booking not found or unauthorized");
            }

            if (booking.status !== 'CHARGING') {
                throw new Error("No active charging session found");
            }

            // Calculate duration and cost
            const startTime = new Date(booking.chargingHistory.createdAt);
            const endTime = new Date();
            const duration = Math.round((endTime - startTime) / (1000 * 60)); // minutes
            
            // Cost calculation (₹8 per kWh as example)
            const costPerKWh = 8;
            const cost = energyUsed * costPerKWh;

            // Update charging history
            const updatedHistory = await prisma.chargingHistory.update({
                where: { bookingId: bookingId },
                data: {
                    energyUsed: energyUsed,
                    cost: cost,
                    duration: duration
                }
            });

            // Update booking status
            await prisma.booking.update({
                where: { id: bookingId },
                data: { status: 'CHARGING_DONE' }
            });

            // Free up the slot
            await prisma.chargingSlot.update({
                where: { id: booking.slotId },
                data: { isOccupied: false }
            });

            // Update station available slots
            await prisma.station.update({
                where: { id: booking.stationId },
                data: {
                    availableSlots: {
                        increment: 1
                    }
                }
            });

            // Create notification
            await prisma.notification.create({
                data: {
                    userId: userId,
                    message: `Charging completed! Energy used: ${energyUsed} kWh, Cost: ₹${cost}`,
                    type: 'BOOKING_CONFIRMATION'
                }
            });

            return updatedHistory;
        } catch (error) {
            console.error("Error ending charging session:", error);
            throw new Error("Failed to end charging session");
        }
    }

    // Get user charging history with pagination
    async getUserChargingHistory(userId, page = 1, limit = 10, startDate, endDate) {
        try {
            const skip = (page - 1) * limit;
            
            const dateFilter = {};
            if (startDate) dateFilter.gte = new Date(startDate);
            if (endDate) dateFilter.lte = new Date(endDate);

            const whereClause = {
                userId,
                ...(Object.keys(dateFilter).length > 0 && {
                    createdAt: dateFilter
                })
            };

            const [history, total] = await Promise.all([
                prisma.chargingHistory.findMany({
                    where: whereClause,
                    include: {
                        station: {
                            select: {
                                name: true,
                                address: true
                            }
                        },
                        booking: {
                            include: {
                                ev: {
                                    select: {
                                        brand: true,
                                        model: true,
                                        licensePlate: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: limit
                }),
                prisma.chargingHistory.count({ where: whereClause })
            ]);

            // Calculate summary statistics
            const summary = await this.calculateUserSummary(userId, dateFilter);

            return {
                data: history,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                },
                summary
            };
        } catch (error) {
            console.error("Error fetching charging history:", error);
            throw new Error("Failed to fetch charging history");
        }
    }

    // Get station charging analytics
    async getStationChargingAnalytics(stationId, userId, startDate, endDate) {
        try {
            // Verify user owns the station
            const station = await prisma.station.findUnique({
                where: { id: stationId }
            });

            if (!station || station.ownerId !== userId) {
                throw new Error("Station not found or unauthorized");
            }

            const dateFilter = {};
            if (startDate) dateFilter.gte = new Date(startDate);
            if (endDate) dateFilter.lte = new Date(endDate);

            const whereClause = {
                stationId,
                ...(Object.keys(dateFilter).length > 0 && {
                    createdAt: dateFilter
                })
            };

            // Get charging sessions
            const sessions = await prisma.chargingHistory.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: { name: true, email: true }
                    },
                    booking: {
                        include: {
                            ev: true
                        }
                    }
                }
            });

            // Calculate analytics
            const analytics = {
                totalSessions: sessions.length,
                totalEnergyDispensed: 0,
                totalRevenue: 0,
                averageSessionDuration: 0,
                averageEnergyPerSession: 0,
                peakUsageHours: {},
                monthlyStats: {},
                evTypeStats: {}
            };

            let totalDuration = 0;

            sessions.forEach(session => {
                analytics.totalEnergyDispensed += session.energyUsed;
                analytics.totalRevenue += session.cost;
                totalDuration += session.duration;

                // Peak usage hours
                const hour = new Date(session.createdAt).getHours();
                analytics.peakUsageHours[hour] = (analytics.peakUsageHours[hour] || 0) + 1;

                // Monthly stats
                const month = session.createdAt.toISOString().substring(0, 7);
                if (!analytics.monthlyStats[month]) {
                    analytics.monthlyStats[month] = {
                        sessions: 0,
                        energy: 0,
                        revenue: 0
                    };
                }
                analytics.monthlyStats[month].sessions++;
                analytics.monthlyStats[month].energy += session.energyUsed;
                analytics.monthlyStats[month].revenue += session.cost;

                // EV type stats
                const evBrand = session.booking.ev.brand;
                analytics.evTypeStats[evBrand] = (analytics.evTypeStats[evBrand] || 0) + 1;
            });

            if (sessions.length > 0) {
                analytics.averageSessionDuration = Math.round(totalDuration / sessions.length);
                analytics.averageEnergyPerSession = Math.round((analytics.totalEnergyDispensed / sessions.length) * 100) / 100;
            }

            return analytics;
        } catch (error) {
            console.error("Error fetching station analytics:", error);
            throw new Error("Failed to fetch station analytics");
        }
    }

    // Get charging session details
    async getChargingSessionDetails(sessionId, userId) {
        try {
            const session = await prisma.chargingHistory.findUnique({
                where: { id: sessionId },
                include: {
                    station: true,
                    booking: {
                        include: {
                            ev: true,
                            slot: true
                        }
                    },
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            });

            if (!session) {
                throw new Error("Charging session not found");
            }

            // Check if user has access (owner of session or station owner)
            const hasAccess = session.userId === userId || session.station.ownerId === userId;
            if (!hasAccess) {
                throw new Error("Unauthorized access to session details");
            }

            return session;
        } catch (error) {
            console.error("Error fetching session details:", error);
            throw new Error("Failed to fetch session details");
        }
    }

    // Get energy consumption analytics for user
    async getEnergyConsumptionAnalytics(userId, period) {
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

            const sessions = await prisma.chargingHistory.findMany({
                where: {
                    userId,
                    createdAt: dateFilter
                },
                include: {
                    station: {
                        select: { name: true }
                    },
                    booking: {
                        include: {
                            ev: {
                                select: { brand: true, model: true }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            const analytics = {
                totalEnergyConsumed: 0,
                totalCost: 0,
                totalSessions: sessions.length,
                averageCostPerKWh: 0,
                dailyConsumption: {},
                stationWiseConsumption: {},
                evWiseConsumption: {}
            };

            sessions.forEach(session => {
                analytics.totalEnergyConsumed += session.energyUsed;
                analytics.totalCost += session.cost;

                // Daily consumption
                const date = session.createdAt.toISOString().split('T')[0];
                if (!analytics.dailyConsumption[date]) {
                    analytics.dailyConsumption[date] = { energy: 0, cost: 0, sessions: 0 };
                }
                analytics.dailyConsumption[date].energy += session.energyUsed;
                analytics.dailyConsumption[date].cost += session.cost;
                analytics.dailyConsumption[date].sessions++;

                // Station wise consumption
                const stationName = session.station.name;
                analytics.stationWiseConsumption[stationName] = 
                    (analytics.stationWiseConsumption[stationName] || 0) + session.energyUsed;

                // EV wise consumption
                const evKey = `${session.booking.ev.brand} ${session.booking.ev.model}`;
                analytics.evWiseConsumption[evKey] = 
                    (analytics.evWiseConsumption[evKey] || 0) + session.energyUsed;
            });

            if (analytics.totalEnergyConsumed > 0) {
                analytics.averageCostPerKWh = Math.round((analytics.totalCost / analytics.totalEnergyConsumed) * 100) / 100;
            }

            return analytics;
        } catch (error) {
            console.error("Error fetching energy analytics:", error);
            throw new Error("Failed to fetch energy consumption analytics");
        }
    }

    // Helper method to calculate user summary
    async calculateUserSummary(userId, dateFilter) {
        try {
            const whereClause = {
                userId,
                ...(Object.keys(dateFilter).length > 0 && {
                    createdAt: dateFilter
                })
            };

            const result = await prisma.chargingHistory.aggregate({
                where: whereClause,
                _sum: {
                    energyUsed: true,
                    cost: true,
                    duration: true
                },
                _count: {
                    id: true
                },
                _avg: {
                    energyUsed: true,
                    cost: true,
                    duration: true
                }
            });

            return {
                totalSessions: result._count.id || 0,
                totalEnergyUsed: result._sum.energyUsed || 0,
                totalCost: result._sum.cost || 0,
                totalDuration: result._sum.duration || 0,
                averageEnergyPerSession: Math.round((result._avg.energyUsed || 0) * 100) / 100,
                averageCostPerSession: Math.round((result._avg.cost || 0) * 100) / 100,
                averageDurationPerSession: Math.round(result._avg.duration || 0)
            };
        } catch (error) {
            console.error("Error calculating summary:", error);
            return {};
        }
    }
}

module.exports = new ChargingHistoryService();