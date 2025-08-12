import React, { useState, useEffect } from 'react';
import { notificationEndpoints } from '../../services/api';
import { apiConnector } from '../../services/apiconnector';
import { toast } from 'react-toastify';
import { Bell, Check, Trash2, X } from 'lucide-react';

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all, unread

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiConnector('GET', notificationEndpoints.GET_USER_NOTIFICATIONS_API, null, {}, {
        page: 1,
        limit: 20,
        unreadOnly: filter === 'unread'
      });
      
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiConnector('PUT', `${notificationEndpoints.MARK_AS_READ_API}/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiConnector('PUT', notificationEndpoints.MARK_ALL_AS_READ_API);
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await apiConnector('DELETE', `${notificationEndpoints.DELETE_NOTIFICATION_API}/${notificationId}`);
      setNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      );
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'BOOKING_CONFIRMATION':
        return '✅';
      case 'BOOKING_CANCELLATION':
        return '❌';
      case 'PAYMENT_SUCCESS':
        return '💳';
      case 'PENALTY_APPLIED':
        return '⚠️';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'BOOKING_CONFIRMATION':
        return 'text-green-600';
      case 'BOOKING_CANCELLATION':
        return 'text-red-600';
      case 'PAYMENT_SUCCESS':
        return 'text-blue-600';
      case 'PENALTY_APPLIED':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter and Actions */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === 'unread'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Unread
              </button>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No notifications found</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-lg">
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${getNotificationColor(notification.type)}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-green-600"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;