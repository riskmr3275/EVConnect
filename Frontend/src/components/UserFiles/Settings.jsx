import React, { useState } from 'react';

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
  const [darkMode, setDarkMode] = useState(false);

  const toggleSwitch = (checked, setChecked) => () => setChecked(!checked);

  return (
    <main className="flex-1 overflow-y-auto py-6 px-4 md:px-6">
    <div className="container mx-auto ">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Settings</h2>

      {/* Account Settings */}
      <Section title="Account Settings">
        <SettingItem
          title="Profile Information"
          description="Update your account details"
          action={<button className="text-sm px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">Edit Profile</button>}
        />
        <SettingItem
          title="Password"
          description="Change your password"
          action={<button className="text-sm px-4 py-2 border border-gray-300 rounded-lg">Change Password</button>}
        />
        <SettingItem
          title="Two-Factor Authentication"
          description="Secure your account with 2FA"
          action={<button className="text-sm px-4 py-2 border border-gray-300 rounded-lg">Enable 2FA</button>}
        />
      </Section>

      {/* Notification Settings */}
      <Section title="Notification Settings">
        {[
          { label: 'Email Notifications', desc: 'Receive booking confirmations and reminders', checked: true },
          { label: 'Push Notifications', desc: 'Get alerts on your device', checked: true },
          { label: 'SMS Notifications', desc: 'Receive text messages for important updates', checked: false },
        ].map((item, i) => (
          <SettingItem
            key={i}
            title={item.label}
            description={item.desc}
            action={
              <div className="relative inline-block w-12 align-middle select-none">
                <input type="checkbox" className="sr-only" defaultChecked={item.checked} />
                <div className="block h-6 bg-gray-300 rounded-full w-12"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
              </div>
            }
          />
        ))}
      </Section>

      {/* App Settings */}
      <Section title="App Settings">
        <SettingItem
          title="Dark Mode"
          description="Toggle between light and dark themes"
          action={
            <div className="relative inline-block w-12 align-middle select-none">
              <input
                type="checkbox"
                className="sr-only"
                checked={darkMode}
                onChange={toggleSwitch(darkMode, setDarkMode)}
              />
              <div className="block h-6 bg-gray-300 rounded-full w-12"></div>
              <div className={`dot absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}></div>
            </div>
          }
        />
        <SettingItem
          title="Language"
          description="Choose your preferred language"
          action={
            <select className="py-2 px-3 rounded-lg border border-gray-300 bg-transparent">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Chinese</option>
            </select>
          }
        />
        <SettingItem
          title="Distance Unit"
          description="Choose between kilometers and miles"
          action={
            <select className="py-2 px-3 rounded-lg border border-gray-300 bg-transparent">
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
            <button className="text-sm px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
              Delete Account
            </button>
          }
        />
      </Section>
    </div>
    </main>
  );
};

export default Settings;
