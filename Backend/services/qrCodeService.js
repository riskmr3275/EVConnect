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
                    },
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            });

            if (!booking) {
                throw new Error('Booking not found');
            }

            // Create QR code data
            const qrData = {
                bookingId: booking.id,
                stationName: booking.station.name,
                userName: booking.user.name,
                evDetails: `${booking.ev.brand} ${booking.ev.model} (${booking.ev.licensePlate})`,
                slotType: booking.slot.type,
                powerLevel: booking.slot.powerLevel,
                startTime: booking.startTime.toISOString(),
                endTime: booking.endTime.toISOString(),
                status: booking.status,
                timestamp: new Date().toISOString()
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

            // Store QR code in database (you might want to add a qrCode field to booking table)
            // For now, we'll return the QR code data
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

    // Verify QR code data
    async verifyQRCode(qrCodeData) {
        try {
            const data = JSON.parse(qrCodeData);
            
            if (data.bookingId) {
                // Verify booking QR code
                const booking = await prisma.booking.findUnique({
                    where: { id: data.bookingId },
                    include: {
                        station: true,
                        user: true,
                        ev: true,
                        slot: true
                    }
                });

                if (!booking) {
                    return { valid: false, message: 'Booking not found' };
                }

                // Check if booking is still valid
                const now = new Date();
                const startTime = new Date(booking.startTime);
                const endTime = new Date(booking.endTime);

                if (booking.status === 'CANCELLED') {
                    return { valid: false, message: 'Booking has been cancelled' };
                }

                if (now > endTime) {
                    return { valid: false, message: 'Booking has expired' };
                }

                if (now < startTime) {
                    return { valid: false, message: 'Booking has not started yet' };
                }

                return {
                    valid: true,
                    booking,
                    message: 'Valid booking QR code'
                };
            }

            if (data.stationId) {
                // Verify station QR code
                const station = await prisma.station.findUnique({
                    where: { id: data.stationId }
                });

                if (!station) {
                    return { valid: false, message: 'Station not found' };
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