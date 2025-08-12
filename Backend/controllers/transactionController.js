const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prisma = require('../config/database');

class TransactionController {
    // Create payment intent for Stripe
    async createPaymentIntent(req, res) {
        try {
            const { amount, bookingId, currency = 'inr' } = req.body;
            const userId = req.user.userId;

            // Validate booking exists and belongs to user
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: { station: true }
            });

            if (!booking || booking.userId !== userId) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found or unauthorized'
                });
            }

            // Create payment intent with Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount), // Amount in smallest currency unit (paise for INR)
                currency: currency,
                metadata: {
                    bookingId: bookingId,
                    userId: userId,
                    stationName: booking.station.name
                },
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            // Store payment intent in database
            await prisma.transaction.create({
                data: {
                    userId: userId,
                    bookingId: bookingId,
                    amount: amount / 100, // Store in rupees
                    currency: currency,
                    type: 'PAYMENT',
                    status: 'PENDING',
                    paymentIntentId: paymentIntent.id,
                    paymentMethod: 'STRIPE'
                }
            });

            res.status(200).json({
                success: true,
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            });

        } catch (error) {
            console.error('Error creating payment intent:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to create payment intent'
            });
        }
    }

    // Confirm payment after successful Stripe payment
    async confirmPayment(req, res) {
        try {
            const { paymentIntentId, bookingId } = req.body;
            const userId = req.user.userId;

            // Retrieve payment intent from Stripe
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            if (paymentIntent.status !== 'succeeded') {
                return res.status(400).json({
                    success: false,
                    message: 'Payment not successful'
                });
            }

            // Update transaction status
            const transaction = await prisma.transaction.updateMany({
                where: {
                    paymentIntentId: paymentIntentId,
                    userId: userId,
                    bookingId: bookingId
                },
                data: {
                    status: 'COMPLETED',
                    completedAt: new Date()
                }
            });

            // Update booking status to confirmed
            await prisma.booking.update({
                where: { id: bookingId },
                data: { 
                    status: 'CONFIRMED',
                    confirmedAt: new Date()
                }
            });

            // Generate QR code for the booking
            const qrData = {
                bookingId: bookingId,
                userId: userId,
                timestamp: new Date().toISOString()
            };
            
            // You can implement QR code generation here
            const qrCode = Buffer.from(JSON.stringify(qrData)).toString('base64');

            // Update booking with QR code
            await prisma.booking.update({
                where: { id: bookingId },
                data: { qrCode: qrCode }
            });

            // Create notification
            await prisma.notification.create({
                data: {
                    userId: userId,
                    message: 'Payment successful! Your booking is confirmed.',
                    type: 'PAYMENT_SUCCESS'
                }
            });

            res.status(200).json({
                success: true,
                message: 'Payment confirmed successfully',
                data: {
                    transactionId: transaction.id,
                    qrCode: qrCode
                }
            });

        } catch (error) {
            console.error('Error confirming payment:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to confirm payment'
            });
        }
    }

    // Get user transactions
    async getUserTransactions(req, res) {
        try {
            const userId = req.user.userId;
            const { page = 1, limit = 10, type, status } = req.query;
            const skip = (page - 1) * limit;

            const whereClause = {
                userId,
                ...(type && { type }),
                ...(status && { status })
            };

            const [transactions, total] = await Promise.all([
                prisma.transaction.findMany({
                    where: whereClause,
                    include: {
                        booking: {
                            include: {
                                station: {
                                    select: {
                                        name: true,
                                        address: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    skip: parseInt(skip),
                    take: parseInt(limit)
                }),
                prisma.transaction.count({ where: whereClause })
            ]);

            res.status(200).json({
                success: true,
                data: transactions,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });

        } catch (error) {
            console.error('Error fetching user transactions:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch transactions'
            });
        }
    }

    // Process refund
    async processRefund(req, res) {
        try {
            const { bookingId, reason } = req.body;
            const userId = req.user.userId;

            // Get the original transaction
            const transaction = await prisma.transaction.findFirst({
                where: {
                    bookingId: bookingId,
                    userId: userId,
                    type: 'PAYMENT',
                    status: 'COMPLETED'
                },
                include: {
                    booking: true
                }
            });

            if (!transaction) {
                return res.status(404).json({
                    success: false,
                    message: 'Transaction not found'
                });
            }

            // Calculate refund amount based on cancellation policy
            const refundAmount = this.calculateRefundAmount(transaction.booking);

            if (refundAmount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No refund available for this booking'
                });
            }

            // Process refund with Stripe
            const refund = await stripe.refunds.create({
                payment_intent: transaction.paymentIntentId,
                amount: Math.round(refundAmount * 100), // Convert to paise
                reason: 'requested_by_customer',
                metadata: {
                    bookingId: bookingId,
                    originalAmount: transaction.amount,
                    refundReason: reason
                }
            });

            // Create refund transaction record
            await prisma.transaction.create({
                data: {
                    userId: userId,
                    bookingId: bookingId,
                    amount: refundAmount,
                    currency: transaction.currency,
                    type: 'REFUND',
                    status: 'COMPLETED',
                    paymentIntentId: refund.id,
                    paymentMethod: 'STRIPE',
                    completedAt: new Date()
                }
            });

            // Create notification
            await prisma.notification.create({
                data: {
                    userId: userId,
                    message: `Refund of ₹${refundAmount} processed successfully.`,
                    type: 'REFUND_PROCESSED'
                }
            });

            res.status(200).json({
                success: true,
                message: 'Refund processed successfully',
                data: {
                    refundAmount: refundAmount,
                    refundId: refund.id
                }
            });

        } catch (error) {
            console.error('Error processing refund:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to process refund'
            });
        }
    }

    // Helper method to calculate refund amount
    calculateRefundAmount(booking) {
        const now = new Date();
        const startTime = new Date(booking.startTime);
        const hoursUntilStart = (startTime - now) / (1000 * 60 * 60);

        // Refund policy: 100% if >24h, 50% if >2h, 0% if <2h
        if (hoursUntilStart >= 24) {
            return booking.estimatedCost || 0;
        } else if (hoursUntilStart >= 2) {
            return (booking.estimatedCost || 0) * 0.5;
        } else {
            return 0;
        }
    }

    // Get transaction analytics
    async getTransactionAnalytics(req, res) {
        try {
            const userId = req.user.userId;
            const { period = 'month', stationId } = req.query;

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
                userId,
                createdAt: dateFilter,
                ...(stationId && {
                    booking: {
                        stationId: stationId
                    }
                })
            };

            const transactions = await prisma.transaction.findMany({
                where: whereClause,
                include: {
                    booking: {
                        include: {
                            station: {
                                select: { name: true }
                            }
                        }
                    }
                }
            });

            const analytics = {
                totalTransactions: transactions.length,
                totalAmount: 0,
                totalRefunds: 0,
                successfulPayments: 0,
                failedPayments: 0,
                averageTransactionValue: 0,
                transactionsByType: {},
                dailyTransactions: {},
                stationWiseSpending: {}
            };

            transactions.forEach(transaction => {
                // Amount calculations
                if (transaction.type === 'PAYMENT' && transaction.status === 'COMPLETED') {
                    analytics.totalAmount += transaction.amount;
                    analytics.successfulPayments++;
                } else if (transaction.type === 'REFUND') {
                    analytics.totalRefunds += transaction.amount;
                } else if (transaction.status === 'FAILED') {
                    analytics.failedPayments++;
                }

                // Type breakdown
                analytics.transactionsByType[transaction.type] = 
                    (analytics.transactionsByType[transaction.type] || 0) + 1;

                // Daily breakdown
                const date = transaction.createdAt.toISOString().split('T')[0];
                analytics.dailyTransactions[date] = 
                    (analytics.dailyTransactions[date] || 0) + transaction.amount;

                // Station wise spending
                if (transaction.booking && transaction.booking.station) {
                    const stationName = transaction.booking.station.name;
                    analytics.stationWiseSpending[stationName] = 
                        (analytics.stationWiseSpending[stationName] || 0) + transaction.amount;
                }
            });

            if (analytics.successfulPayments > 0) {
                analytics.averageTransactionValue = 
                    Math.round((analytics.totalAmount / analytics.successfulPayments) * 100) / 100;
            }

            res.status(200).json({
                success: true,
                data: analytics
            });

        } catch (error) {
            console.error('Error fetching transaction analytics:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch analytics'
            });
        }
    }
}

module.exports = new TransactionController();