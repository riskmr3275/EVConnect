import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { apiConnector } from '../../services/apiconnector';
import { authEndpoints } from '../../services/api';

// Reusable section wrapper
const Section = ({ title, children, danger = false }) => (
  <div className={`rounded-lg shadow-sm p-6 border ${danger ? 'border-red-400' : 'border-gray-300'} mb-6 bg-white`}>
    <h3 className={`text-lg font-semibold mb-4 ${danger ? 'text-red-500' : 'text-gray-800'}`}>{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

// Reusable item inside a section
const SettingItem = ({ title, description, action }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between">
    <div className="mb-2 md:mb-0">
      <h4 className="font-medium text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    {action}
  </div>
);

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });
  const [language, setLanguage] = useState('English');
  const [distanceUnit, setDistanceUnit] = useState('Kilometers (km)');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load user preferences from localStorage or API
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedLanguage = localStorage.getItem('language') || 'English';
    const savedDistanceUnit = localStorage.getItem('distanceUnit') || 'Kilometers (km)';
    const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '{"email":true,"push":true,"sms":false}');
    
    setDarkMode(savedDarkMode);
    setLanguage(savedLanguage);
    setDistanceUnit(savedDistanceUnit);
    setNotifications(savedNotifications);
  }, []);

  const handleEditProfile = () => {
    navigate('/dashboard/profile-management');
  };

  const handleChangePassword = () => {
    navigate('/dashboard/profile-management?tab=security');
  };

  const handleEnable2FA = () => {
    toast.info('Two-Factor Authentication setup coming soon!');
  };

  const handleNotificationChange = (type) => {
    const newNotifications = {
      ...notifications,
      [type]: !notifications[type]
    };
    setNotifications(newNotifications);
    localStorage.setItem('notifications', JSON.stringify(newNotifications));
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${newNotifications[type] ? 'enabled' : 'disabled'}`);
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // Apply dark mode to document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast.success(`Dark mode ${newDarkMode ? 'enabled' : 'disabled'}`);
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    toast.success(`Language changed to ${newLanguage}`);
  };

  const handleDistanceUnitChange = (e) => {
    const newUnit = e.target.value;
    setDistanceUnit(newUnit);
    localStorage.setItem('distanceUnit', newUnit);
    toast.success(`Distance unit changed to ${newUnit}`);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      
      // Call delete account API
      const response = await apiConnector('DELETE', `${authEndpoints.DELETE_ACCOUNT_API}`);
      
      if (response.data.success) {
        toast.success('Account deleted successfully');
        // Clear local storage and redirect to login
        localStorage.clear();
        navigate('/login');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto py-6 px-4 md:px-6">
    <div className="container mx-auto ">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Settings</h2>

      {/* Account Settings */}
      <Section title="Account Settings">
        <SettingItem
          title="Profile Information"
          description="Update your account details"
          action={
            <button 
              onClick={handleEditProfile}
              className="text-sm px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Edit Profile
            </button>
          }
        />
        <SettingItem
          title="Password"
          description="Change your password"
          action={
            <button 
              onClick={handleChangePassword}
              className="text-sm px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Change Password
            </button>
          }
        />
        <SettingItem
          title="Two-Factor Authentication"
          description="Secure your account with 2FA"
          action={
            <button 
              onClick={handleEnable2FA}
              className="text-sm px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Enable 2FA
            </button>
          }
        />
      </Section>

      {/* Notification Settings */}
      <Section title="Notification Settings">
        <SettingItem
          title="Email Notifications"
          description="Receive booking confirmations and reminders"
          action={
            <button
              onClick={() => handleNotificationChange('email')}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                notifications.email ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.email ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          }
        />
        <SettingItem
          title="Push Notifications"
          description="Get alerts on your device"
          action={
            <button
              onClick={() => handleNotificationChange('push')}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                notifications.push ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.push ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          }
        />
        <SettingItem
          title="SMS Notifications"
          description="Receive text messages for important updates"
          action={
            <button
              onClick={() => handleNotificationChange('sms')}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                notifications.sms ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.sms ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          }
        />
      </Section>

      {/* App Settings */}
      <Section title="App Settings">
        <SettingItem
          title="Dark Mode"
          description="Toggle between light and dark themes"
          action={
            <button
              onClick={handleDarkModeToggle}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                darkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          }
        />
        <SettingItem
          title="Language"
          description="Choose your preferred language"
          action={
            <select 
              value={language}
              onChange={handleLanguageChange}
              className="py-2 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Chinese</option>
              <option>Hindi</option>
            </select>
          }
        />
        <SettingItem
          title="Distance Unit"
          description="Choose between kilometers and miles"
          action={
            <select 
              value={distanceUnit}
              onChange={handleDistanceUnitChange}
              className="py-2 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
            >
              <option>Kilometers (km)</option>
              <option>Miles (mi)</option>
            </select>
          }
        />
      </Section>

      {/* Danger Zone */}
      <Section title="Danger Zone" danger>
        <SettingItem
          title="Delete Account"
          description="Permanently delete your account and all data"
          action={
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="text-sm px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Delete Account
            </button>
          }
        />
      </Section>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and will permanently remove:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mb-6 space-y-1">
              <li>Your profile information</li>
              <li>All your bookings and history</li>
              <li>Your registered EVs</li>
              <li>All associated data</li>
            </ul>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </main>
  );
};

export default Settings;
