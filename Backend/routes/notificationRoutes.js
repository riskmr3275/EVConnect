const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { auth, isAdmin } = require('../middlewares/Auth');

// Get user notifications
router.get('/user-notifications', auth, notificationController.getUserNotifications);

// Mark notification as read
router.put('/:notificationId/read', auth, notificationController.markAsRead);

// Mark all notifications as read
router.put('/mark-all-read', auth, notificationController.markAllAsRead);

// Delete notification
router.delete('/:notificationId', auth, notificationController.deleteNotification);

// Send notification (admin only)
router.post('/send', auth, isAdmin, notificationController.sendNotification);

// Send bulk notifications (admin only)
router.post('/send-bulk', auth, isAdmin, notificationController.sendBulkNotifications);

// Get notification statistics
router.get('/stats', auth, notificationController.getNotificationStats);

module.exports = router;