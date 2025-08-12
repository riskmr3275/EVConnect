const qrCodeService = require('../services/qrCodeService');

class QRCodeController {
    // Generate QR code for booking
    async generateBookingQRCode(req, res) {
        try {
            const { bookingId } = req.params;
            const userId = req.user.userId;

            // Verify user owns the booking
            const prisma = require('../config/database');
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId }
            });

            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }

            if (booking.userId !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized access to booking'
                });
            }

            const qrCodeResult = await qrCodeService.generateBookingQRCode(bookingId);

            res.status(200).json({
                success: true,
                message: 'QR code generated successfully',
                qrCode: qrCodeResult.qrCodeDataURL,
                data: qrCodeResult.qrData
            });

        } catch (error) {
            console.error('Error generating booking QR code:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Generate QR code for station
    async generateStationQRCode(req, res) {
        try {
            const { stationId } = req.params;
            const userId = req.user.userId;

            const qrCodeResult = await qrCodeService.generateStationQRCode(stationId, userId);

            res.status(200).json({
                success: true,
                message: 'Station QR code generated successfully',
                qrCode: qrCodeResult.qrCodeDataURL,
                data: qrCodeResult.qrData
            });

        } catch (error) {
            console.error('Error generating station QR code:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Verify QR code
    async verifyQRCode(req, res) {
        try {
            const { qrData } = req.body;

            if (!qrData) {
                return res.status(400).json({
                    success: false,
                    message: 'QR code data is required'
                });
            }

            const verificationResult = await qrCodeService.verifyQRCode(qrData);

            res.status(200).json({
                success: true,
                verification: verificationResult
            });

        } catch (error) {
            console.error('Error verifying QR code:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Generate charging session QR code
    async generateChargingSessionQRCode(req, res) {
        try {
            const { bookingId } = req.params;
            const { sessionData } = req.body;
            const userId = req.user.userId;

            // Verify user owns the booking
            const prisma = require('../config/database');
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId }
            });

            if (!booking || booking.userId !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized access to booking'
                });
            }

            const qrCodeResult = await qrCodeService.generateChargingSessionQRCode(bookingId, sessionData);

            res.status(200).json({
                success: true,
                message: 'Charging session QR code generated successfully',
                qrCode: qrCodeResult.qrCodeDataURL,
                data: qrCodeResult.qrData
            });

        } catch (error) {
            console.error('Error generating charging session QR code:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new QRCodeController();