const prisma = require("../config/database");

// Initialize Stripe only if the secret key is available
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
    console.warn('⚠️  STRIPE_SECRET_KEY not found in environment variables. Payment features will be disabled.');
}

class TransactionService {
    // Create Stripe payment intent
    async createPaymentIntent(userId, bookingId, amount) {
        try {
            if (!stripe) {
                throw new Error("Payment gateway not configured. Please set STRIPE_SECRET_KEY environment variable.");
            }

            // Get booking details
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    user: true,
                    station: true,
                    ev: true
                }
            });

            if (!booking) {
                throw new Error("Booking not found");
            }

            if (booking.userId !== userId) {
                throw new Error("Unauthorized access to booking");
            }

            // Create payment intent with Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: 'inr',
                metadata: {
                    bookingId: bookingId,
                    userId: userId,
                    stationName: booking.station.name
                },
                description: `EV Charging at ${booking.station.name}`
            });

            // Create pending transaction record
            const transaction = await prisma.transaction.create({
                data: {
                    userId: userId,
                    bookingId: bookingId,
                    amount: amount,
                    type: 'PAYMENT',
                    status: 'PENDING'
                }
            });

            return paymentIntent;
        } catch (error) {
            console.error("Error creating payment intent:", error);
            throw new Error("Failed to create payment intent");
        }
    }

    // Confirm payment and update records
    async confirmPayment(paymentIntentId, bookingId, userId) {
        try {
            if (!stripe) {
                throw new Error("Payment gateway not configured. Please set STRIPE_SECRET_KEY environment variable.");
            }

            // Verify payment with Stripe
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            if (paymentIntent.status !== 'succeeded') {
                throw new Error("Payment not successful");
            }

            // Update transaction status
            const transaction = await prisma.transaction.updateMany({
                where: {
                    bookingId: bookingId,
                    userId: userId,
                    status: 'PENDING'
                },
                data: {
                    status: 'COMPLETED'
                }
            });

            // Generate QR code for the booking
            const qrCodeService = require('./qrCodeService');
            const qrCodeResult = await qrCodeService.generateBookingQRCode(bookingId);

            // Update booking status and add QR code
            await prisma.booking.update({
                where: { id: bookingId },
                data: { 
                    status: 'CONFIRMED',
                    qrCode: qrCodeResult.qrCodeDataURL,
                    qrCodeData: JSON.stringify(qrCodeResult.qrData)
                }
            });

            // Create notification
            await prisma.notification.create({
                data: {
                    userId: userId,
                    message: "Payment successful! Your booking is confirmed. QR code generated.",
                    type: 'PAYMENT_SUCCESS'
                }
            });

            return transaction;
        } catch (error) {
            console.error("Error confirming payment:", error);
            throw new Error("Failed to confirm payment");
        }
    }

    // Get user transactions with pagination
    async getUserTransactions(userId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;

            const [transactions, total] = await Promise.all([
                prisma.transaction.findMany({
                    where: { userId },
                    include: {
                        booking: {
                            include: {
                                station: true,
                                ev: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: limit
                }),
                prisma.transaction.count({ where: { userId } })
            ]);

            return {
                data: transactions,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error("Error fetching transactions:", error);
            throw new Error("Failed to fetch transactions");
        }
    }

    // Process refund
    async processRefund(bookingId, userId, reason) {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: { transaction: true }
            });

            if (!booking || booking.userId !== userId) {
                throw new Error("Booking not found or unauthorized");
            }

            if (!booking.transaction) {
                throw new Error("No payment found for this booking");
            }

            // Calculate refund amount (could include penalties)
            const refundAmount = this.calculateRefundAmount(booking);

            // Create refund with Stripe (if original payment exists)
            let stripeRefund = null;
            if (booking.transaction.status === 'COMPLETED') {
                // In real implementation, you'd need to store Stripe payment intent ID
                // stripeRefund = await stripe.refunds.create({
                //     payment_intent: booking.transaction.stripePaymentIntentId,
                //     amount: Math.round(refundAmount * 100)
                // });
            }

            // Create refund transaction
            const refundTransaction = await prisma.transaction.create({
                data: {
                    userId: userId,
                    bookingId: bookingId,
                    amount: refundAmount,
                    type: 'REFUND',
                    status: 'COMPLETED'
                }
            });

            // Update booking status
            await prisma.booking.update({
                where: { id: bookingId },
                data: { status: 'CANCELLED' }
            });

            // Create notification
            await prisma.notification.create({
                data: {
                    userId: userId,
                    message: `Refund of ₹${refundAmount} processed for cancelled booking.`,
                    type: 'BOOKING_CANCELLATION'
                }
            });

            return refundTransaction;
        } catch (error) {
            console.error("Error processing refund:", error);
            throw new Error("Failed to process refund");
        }
    }

    // Apply penalty
    async applyPenalty(bookingId, amount, reason) {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: { user: true }
            });

            if (!booking) {
                throw new Error("Booking not found");
            }

            // Create penalty transaction
            const penaltyTransaction = await prisma.transaction.create({
                data: {
                    userId: booking.userId,
                    bookingId: bookingId,
                    amount: amount,
                    type: 'PENALTY',
                    status: 'COMPLETED'
                }
            });

            // Create notification
            await prisma.notification.create({
                data: {
                    userId: booking.userId,
                    message: `Penalty of ₹${amount} applied. Reason: ${reason}`,
                    type: 'PENALTY_APPLIED'
                }
            });

            return penaltyTransaction;
        } catch (error) {
            console.error("Error applying penalty:", error);
            throw new Error("Failed to apply penalty");
        }
    }

    // Get transaction analytics for station owners
    async getTransactionAnalytics(ownerId, startDate, endDate) {
        try {
            const dateFilter = {};
            if (startDate) dateFilter.gte = new Date(startDate);
            if (endDate) dateFilter.lte = new Date(endDate);

            // Get owner's stations
            const stations = await prisma.station.findMany({
                where: { ownerId },
                select: { id: true }
            });

            const stationIds = stations.map(s => s.id);

            // Get transactions for owner's stations
            const transactions = await prisma.transaction.findMany({
                where: {
                    booking: {
                        stationId: { in: stationIds }
                    },
                    ...(Object.keys(dateFilter).length > 0 && {
                        createdAt: dateFilter
                    })
                },
                include: {
                    booking: {
                        include: { station: true }
                    }
                }
            });

            // Calculate analytics
            const analytics = {
                totalRevenue: 0,
                totalTransactions: transactions.length,
                paymentTransactions: 0,
                refundTransactions: 0,
                penaltyTransactions: 0,
                stationWiseRevenue: {},
                monthlyRevenue: {}
            };

            transactions.forEach(transaction => {
                const stationName = transaction.booking.station.name;
                const month = transaction.createdAt.toISOString().substring(0, 7);

                if (transaction.type === 'PAYMENT' && transaction.status === 'COMPLETED') {
                    analytics.totalRevenue += transaction.amount;
                    analytics.paymentTransactions++;

                    analytics.stationWiseRevenue[stationName] =
                        (analytics.stationWiseRevenue[stationName] || 0) + transaction.amount;

                    analytics.monthlyRevenue[month] =
                        (analytics.monthlyRevenue[month] || 0) + transaction.amount;
                } else if (transaction.type === 'REFUND') {
                    analytics.refundTransactions++;
                } else if (transaction.type === 'PENALTY') {
                    analytics.penaltyTransactions++;
                }
            });

            return analytics;
        } catch (error) {
            console.error("Error fetching analytics:", error);
            throw new Error("Failed to fetch transaction analytics");
        }
    }

    // Helper method to calculate refund amount
    calculateRefundAmount(booking) {
        const now = new Date();
        const startTime = new Date(booking.startTime);
        const hoursUntilStart = (startTime - now) / (1000 * 60 * 60);

        // Refund policy: 
        // - Full refund if cancelled 24+ hours before
        // - 50% refund if cancelled 2-24 hours before  
        // - No refund if cancelled less than 2 hours before
        if (hoursUntilStart >= 24) {
            return booking.transaction?.amount || 0;
        } else if (hoursUntilStart >= 2) {
            return (booking.transaction?.amount || 0) * 0.5;
        } else {
            return 0;
        }
    }
}

module.exports = new TransactionService();