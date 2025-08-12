const notificationService = require('../services/notificationService');

class NotificationController {
    // Get user notifications
    async getUserNotifications(req, res) {
        try {
            const userId = req.user.userId;
            const { page = 1, limit = 20, unreadOnly = false } = req.query;
            
            const notifications = await notificationService.getUserNotifications(
                userId, 
                parseInt(page), 
                parseInt(limit),
                unreadOnly === 'true'
            );
            
            res.status(200).json({
                success: true,
                notifications: notifications.data,
                pagination: notifications.pagination,
                unreadCount: notifications.unreadCount
            });
        } catch (error) {
            console.error("Error fetching notifications:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Mark notification as read
    async markAsRead(req, res) {
        try {
            const { notificationId } = req.params;
            const userId = req.user.userId;
            
            await notificationService.markAsRead(notificationId, userId);
            
            res.status(200).json({
                success: true,
                message: "Notification marked as read"
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Mark all notifications as read
    async markAllAsRead(req, res) {
        try {
            const userId = req.user.userId;
            
            const count = await notificationService.markAllAsRead(userId);
            
            res.status(200).json({
                success: true,
                message: `${count} notifications marked as read`
            });
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Delete notification
    async deleteNotification(req, res) {
        try {
            const { notificationId } = req.params;
            const userId = req.user.userId;
            
            await notificationService.deleteNotification(notificationId, userId);
            
            res.status(200).json({
                success: true,
                message: "Notification deleted"
            });
        } catch (error) {
            console.error("Error deleting notification:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Send notification (admin only)
    async sendNotification(req, res) {
        try {
            const { userId, message, type } = req.body;
            
            const notification = await notificationService.createNotification(
                userId, 
                message, 
                type
            );
            
            res.status(201).json({
                success: true,
                message: "Notification sent successfully",
                notification
            });
        } catch (error) {
            console.error("Error sending notification:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Send bulk notifications (admin only)
    async sendBulkNotifications(req, res) {
        try {
            const { userIds, message, type } = req.body;
            
            const notifications = await notificationService.sendBulkNotifications(
                userIds, 
                message, 
                type
            );
            
            res.status(201).json({
                success: true,
                message: `${notifications.length} notifications sent successfully`,
                notifications
            });
        } catch (error) {
            console.error("Error sending bulk notifications:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Get notification statistics
    async getNotificationStats(req, res) {
        try {
            const userId = req.user.userId;
            
            const stats = await notificationService.getNotificationStats(userId);
            
            res.status(200).json({
                success: true,
                stats
            });
        } catch (error) {
            console.error("Error fetching notification stats:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }
}

module.exports = new NotificationController();