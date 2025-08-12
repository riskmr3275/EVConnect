const QRCode = require('qrcode');
const prisma = require('../config/database');

class QRCodeService {
    // Generate QR code for booking
    async generateBookingQRCode(bookingId) {
        try {
            // Get booking details
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    station: {
                        select: {
                            id: true,
                            name: true,
                            address: true,
                            contact: true
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
                            id: true,
                            slotNumber: true,
                            type: true,
                            powerLevel: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            contactNumber: true
                        }
                    }
                }
            });

            if (!booking) {
                throw new Error('Booking not found');
            }

            // Create comprehensive QR code data
            const qrData = {
                type: 'booking_confirmation',
                bookingId: booking.id,
                userId: booking.user.id,
                stationId: booking.station.id,
                stationName: booking.station.name,
                stationAddress: booking.station.address,
                stationContact: booking.station.contact,
                userName: booking.user.name,
                userContact: booking.user.contactNumber,
                evDetails: `${booking.ev.brand} ${booking.ev.model} (${booking.ev.licensePlate})`,
                slotId: booking.slot.id,
                slotNumber: booking.slot.slotNumber,
                slotType: booking.slot.type,
                powerLevel: booking.slot.powerLevel,
                startTime: booking.startTime.toISOString(),
                endTime: booking.endTime.toISOString(),
                status: booking.status,
                estimatedCost: booking.estimatedCost,
                batteryLevel: booking.batteryLevel,
                generatedAt: new Date().toISOString(),
                version: '2.0' // QR code version for future compatibility
            };

            // Generate QR code as base64 string
            const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
                errorCorrectionLevel: 'M',
                type: 'image/png',
                quality: 0.92,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                width: 256
            });

            // Update booking with QR code data
            await prisma.booking.update({
                where: { id: bookingId },
                data: {
                    qrCode: qrCodeDataURL,
                    qrCodeData: JSON.stringify(qrData)
                }
            });

            return {
                qrCodeDataURL,
                qrData,
                bookingId
            };

        } catch (error) {
            console.error('Error generating QR code:', error);
            throw new Error('Failed to generate QR code');
        }
    }

    // Generate QR code for station access
    async generateStationQRCode(stationId, userId) {
        try {
            const station = await prisma.station.findUnique({
                where: { id: stationId },
                include: {
                    owner: {
                        select: {
                            name: true,
                            contactNumber: true
                        }
                    }
                }
            });

            if (!station) {
                throw new Error('Station not found');
            }

            const qrData = {
                type: 'station_access',
                stationId: station.id,
                stationName: station.name,
                address: station.address,
                contact: station.contact,
                ownerName: station.owner.name,
                totalSlots: station.totalSlots,
                availableSlots: station.availableSlots,
                timestamp: new Date().toISOString()
            };

            const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
                errorCorrectionLevel: 'M',
                type: 'image/png',
                quality: 0.92,
                margin: 1,
                width: 256
            });

            return {
                qrCodeDataURL,
                qrData,
                stationId
            };

        } catch (error) {
            console.error('Error generating station QR code:', error);
            throw new Error('Failed to generate station QR code');
        }
    }

    // Verify and process QR code data
    async verifyQRCode(qrCodeData, stationMasterId) {
        try {
            const data = JSON.parse(qrCodeData);
            
            if (data.type === 'booking_confirmation' && data.bookingId) {
                // Verify booking QR code
                const booking = await prisma.booking.findUnique({
                    where: { id: data.bookingId },
                    include: {
                        station: {
                            include: {
                                stationMasters: {
                                    where: { userId: stationMasterId }
                                }
                            }
                        },
                        user: {
                            select: {
                                id: true,
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
                                id: true,
                                slotNumber: true,
                                type: true,
                                powerLevel: true,
                                isOccupied: true
                            }
                        }
                    }
                });

                if (!booking) {
                    return { valid: false, message: 'Booking not found' };
                }

                // Verify station master has access to this station
                if (booking.station.stationMasters.length === 0) {
                    return { valid: false, message: 'Unauthorized: You do not have access to this station' };
                }

                // Check if booking is still valid
                const now = new Date();
                const startTime = new Date(booking.startTime);
                const endTime = new Date(booking.endTime);
                const gracePeriod = 15 * 60 * 1000; // 15 minutes grace period

                if (booking.status === 'CANCELLED') {
                    return { valid: false, message: 'Booking has been cancelled' };
                }

                if (booking.status === 'CHARGING_DONE') {
                    return { valid: false, message: 'Booking has already been completed' };
                }

                if (now > new Date(endTime.getTime() + gracePeriod)) {
                    return { valid: false, message: 'Booking has expired' };
                }

                if (now < new Date(startTime.getTime() - gracePeriod)) {
                    return { valid: false, message: 'Booking time has not arrived yet' };
                }

                // Check if slot is available
                if (booking.slot.isOccupied && booking.status !== 'CHARGING') {
                    return { valid: false, message: 'Charging slot is currently occupied' };
                }

                return {
                    valid: true,
                    booking,
                    canConfirm: booking.status === 'PENDING' || booking.status === 'CONFIRMED',
                    canComplete: booking.status === 'CHARGING',
                    message: 'Valid booking QR code'
                };
            }

            if (data.stationId) {
                // Verify station QR code
                const station = await prisma.station.findUnique({
                    where: { id: data.stationId },
                    include: {
                        stationMasters: {
                            where: { userId: stationMasterId }
                        }
                    }
                });

                if (!station) {
                    return { valid: false, message: 'Station not found' };
                }

                if (station.stationMasters.length === 0) {
                    return { valid: false, message: 'Unauthorized: You do not have access to this station' };
                }

                return {
                    valid: true,
                    station,
                    message: 'Valid station QR code'
                };
            }

            return { valid: false, message: 'Invalid QR code format' };

        } catch (error) {
            console.error('Error verifying QR code:', error);
            return { valid: false, message: 'Invalid QR code data' };
        }
    }

    // Confirm booking via QR code scan
    async confirmBookingViaQR(bookingId, stationMasterId, slotId) {
        try {
            // Update booking status to confirmed/charging
            const booking = await prisma.booking.update({
                where: { id: bookingId },
                data: {
                    status: 'CHARGING',
                    confirmedAt: new Date()
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    },
                    station: {
                        select: {
                            name: true
                        }
                    }
                }
            });

            // Update slot status to occupied
            await prisma.chargingSlot.update({
                where: { id: slotId },
                data: {
                    isOccupied: true,
                    status: 'OCCUPIED'
                }
            });

            // Create notification for user
            await prisma.notification.create({
                data: {
                    userId: booking.userId,
                    message: `Your charging session has started at ${booking.station.name}`,
                    type: 'BOOKING_CONFIRMATION'
                }
            });

            // Log the confirmation
            console.log(`Booking ${bookingId} confirmed by station master ${stationMasterId}`);

            return {
                success: true,
                booking,
                message: 'Booking confirmed and charging session started'
            };

        } catch (error) {
            console.error('Error confirming booking via QR:', error);
            throw new Error('Failed to confirm booking');
        }
    }

    // Complete charging session
    async completeChargingSession(bookingId, stationMasterId, completionData) {
        try {
            const { energyConsumed, actualCost, chargingDuration } = completionData;

            // Update booking status to completed
            const booking = await prisma.booking.update({
                where: { id: bookingId },
                data: {
                    status: 'CHARGING_DONE',
                    completedAt: new Date(),
                    energyConsumed,
                    actualCost,
                    chargingDuration
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    },
                    station: {
                        select: {
                            name: true
                        }
                    },
                    slot: {
                        select: {
                            id: true
                        }
                    }
                }
            });

            // Free up the slot
            await prisma.chargingSlot.update({
                where: { id: booking.slot.id },
                data: {
                    isOccupied: false,
                    status: 'AVAILABLE'
                }
            });

            // Update station available slots count
            await prisma.station.update({
                where: { id: booking.stationId },
                data: {
                    availableSlots: {
                        increment: 1
                    }
                }
            });

            // Create charging history record
            await prisma.chargingHistory.create({
                data: {
                    userId: booking.userId,
                    stationId: booking.stationId,
                    bookingId: booking.id,
                    evId: booking.evId,
                    energyUsed: energyConsumed,
                    cost: actualCost,
                    duration: chargingDuration
                }
            });

            // Create notification for user
            await prisma.notification.create({
                data: {
                    userId: booking.userId,
                    message: `Your charging session at ${booking.station.name} has been completed. Energy consumed: ${energyConsumed} kWh`,
                    type: 'BOOKING_CONFIRMATION'
                }
            });

            return {
                success: true,
                booking,
                message: 'Charging session completed successfully'
            };

        } catch (error) {
            console.error('Error completing charging session:', error);
            throw new Error('Failed to complete charging session');
        }
    }

    // Generate QR code for charging session
    async generateChargingSessionQRCode(bookingId, sessionData) {
        try {
            const qrData = {
                type: 'charging_session',
                bookingId,
                sessionId: sessionData.sessionId,
                startTime: sessionData.startTime,
                powerLevel: sessionData.powerLevel,
                slotType: sessionData.slotType,
                timestamp: new Date().toISOString()
            };

            const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                quality: 0.92,
                margin: 1,
                width: 200
            });

            return {
                qrCodeDataURL,
                qrData,
                sessionId: sessionData.sessionId
            };

        } catch (error) {
            console.error('Error generating charging session QR code:', error);
            throw new Error('Failed to generate charging session QR code');
        }
    }
}

module.exports = new QRCodeService();