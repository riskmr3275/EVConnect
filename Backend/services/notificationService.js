const prisma = require("../config/database");

class NotificationService {
    // Create a new notification
    async createNotification(userId, message, type) {
        try {
            const notification = await prisma.notification.create({
                data: {
                    userId,
                    message,
                    type,
                    isRead: false
                }
            });

            // Here you could integrate with push notification services
            // like Firebase, OneSignal, etc.
            
            return notification;
        } catch (error) {
            console.error("Error creating notification:", error);
            throw new Error("Failed to create notification");
        }
    }

    // Get user notifications with pagination
    async getUserNotifications(userId, page = 1, limit = 20, unreadOnly = false) {
        try {
            const skip = (page - 1) * limit;
            
            const whereClause = {
                userId,
                ...(unreadOnly && { isRead: false })
            };

            const [notifications, total, unreadCount] = await Promise.all([
                prisma.notification.findMany({
                    where: whereClause,
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: limit
                }),
                prisma.notification.count({ where: whereClause }),
                prisma.notification.count({ 
                    where: { userId, isRead: false } 
                })
            ]);

            return {
                data: notifications,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                },
                unreadCount
            };
        } catch (error) {
            console.error("Error fetching notifications:", error);
            throw new Error("Failed to fetch notifications");
        }
    }

    // Mark notification as read
    async markAsRead(notificationId, userId) {
        try {
            const notification = await prisma.notification.findUnique({
                where: { id: notificationId }
            });

            if (!notification || notification.userId !== userId) {
                throw new Error("Notification not found or unauthorized");
            }

            await prisma.notification.update({
                where: { id: notificationId },
                data: { isRead: true }
            });

            return true;
        } catch (error) {
            console.error("Error marking notification as read:", error);
            throw new Error("Failed to mark notification as read");
        }
    }

    // Mark all notifications as read
    async markAllAsRead(userId) {
        try {
            const result = await prisma.notification.updateMany({
                where: { 
                    userId, 
                    isRead: false 
                },
                data: { isRead: true }
            });

            return result.count;
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            throw new Error("Failed to mark all notifications as read");
        }
    }

    // Delete notification
    async deleteNotification(notificationId, userId) {
        try {
            const notification = await prisma.notification.findUnique({
                where: { id: notificationId }
            });

            if (!notification || notification.userId !== userId) {
                throw new Error("Notification not found or unauthorized");
            }

            await prisma.notification.delete({
                where: { id: notificationId }
            });

            return true;
        } catch (error) {
            console.error("Error deleting notification:", error);
            throw new Error("Failed to delete notification");
        }
    }

    // Send bulk notifications
    async sendBulkNotifications(userIds, message, type) {
        try {
            const notifications = await prisma.notification.createMany({
                data: userIds.map(userId => ({
                    userId,
                    message,
                    type,
                    isRead: false
                }))
            });

            return notifications;
        } catch (error) {
            console.error("Error sending bulk notifications:", error);
            throw new Error("Failed to send bulk notifications");
        }
    }

    // Get notification statistics
    async getNotificationStats(userId) {
        try {
            const [total, unread, byType] = await Promise.all([
                prisma.notification.count({ where: { userId } }),
                prisma.notification.count({ where: { userId, isRead: false } }),
                prisma.notification.groupBy({
                    by: ['type'],
                    where: { userId },
                    _count: { type: true }
                })
            ]);

            const typeStats = {};
            byType.forEach(item => {
                typeStats[item.type] = item._count.type;
            });

            return {
                total,
                unread,
                read: total - unread,
                byType: typeStats
            };
        } catch (error) {
            console.error("Error fetching notification stats:", error);
            throw new Error("Failed to fetch notification statistics");
        }
    }

    // Send booking confirmation notification
    async sendBookingConfirmation(userId, bookingDetails) {
        try {
            const message = `Your booking at ${bookingDetails.stationName} has been confirmed for ${new Date(bookingDetails.startTime).toLocaleString()}`;
            
            return await this.createNotification(
                userId, 
                message, 
                'BOOKING_CONFIRMATION'
            );
        } catch (error) {
            console.error("Error sending booking confirmation:", error);
            throw new Error("Failed to send booking confirmation");
        }
    }

    // Send payment success notification
    async sendPaymentSuccess(userId, amount, bookingDetails) {
        try {
            const message = `Payment of ₹${amount} successful for your booking at ${bookingDetails.stationName}`;
            
            return await this.createNotification(
                userId, 
                message, 
                'PAYMENT_SUCCESS'
            );
        } catch (error) {
            console.error("Error sending payment success notification:", error);
            throw new Error("Failed to send payment success notification");
        }
    }

    // Send booking cancellation notification
    async sendBookingCancellation(userId, bookingDetails, refundAmount = 0) {
        try {
            const message = `Your booking at ${bookingDetails.stationName} has been cancelled. ${refundAmount > 0 ? `Refund of ₹${refundAmount} will be processed.` : ''}`;
            
            return await this.createNotification(
                userId, 
                message, 
                'BOOKING_CANCELLATION'
            );
        } catch (error) {
            console.error("Error sending cancellation notification:", error);
            throw new Error("Failed to send cancellation notification");
        }
    }

    // Send penalty notification
    async sendPenaltyNotification(userId, amount, reason) {
        try {
            const message = `A penalty of ₹${amount} has been applied to your account. Reason: ${reason}`;
            
            return await this.createNotification(
                userId, 
                message, 
                'PENALTY_APPLIED'
            );
        } catch (error) {
            console.error("Error sending penalty notification:", error);
            throw new Error("Failed to send penalty notification");
        }
    }

    // Clean up old notifications (can be run as a cron job)
    async cleanupOldNotifications(daysOld = 30) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);

            const result = await prisma.notification.deleteMany({
                where: {
                    createdAt: {
                        lt: cutoffDate
                    },
                    isRead: true
                }
            });

            console.log(`Cleaned up ${result.count} old notifications`);
            return result.count;
        } catch (error) {
            console.error("Error cleaning up notifications:", error);
            throw new Error("Failed to cleanup old notifications");
        }
    }
}

module.exports = new NotificationService();