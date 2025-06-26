import React from 'react';
import { Menu, MapPin, Clock, Zap, Wifi, Users, ShoppingBag } from 'lucide-react';

export default function StationProfile() {
  const amenities = [
    { icon: Zap, label: 'Fast Charging', color: 'text-yellow-600' },
    { icon: Zap, label: 'Level 2 Charging', color: 'text-blue-600' },
    { icon: Wifi, label: 'WiFi', color: 'text-gray-600' },
    { icon: Users, label: 'Restrooms', color: 'text-gray-600' },
    { icon: ShoppingBag, label: 'Convenience Store', color: 'text-gray-600' }
  ];

  const statistics = [
    { value: '12', label: 'Total Chargers', color: 'text-blue-500' },
    { value: '8.5k', label: 'Sessions This Month', color: 'text-green-500' },
    { value: '4.8', label: 'Average Rating', color: 'text-purple-500' },
    { value: '98.2%', label: 'Uptime', color: 'text-orange-500' }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header */}
      <div className="mb-8">
         
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Station Profile</h1>
            <p className="text-gray-500">Manage your station information and settings</p>
          </div>
          <button className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-8">
        {/* Basic Information & Operating Hours */}
        <div className="grid grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Basic Information</h2>
              <p className="text-gray-500 text-sm">Station name, contact details, and location</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Station Name</label>
                <div className="text-gray-900 font-medium">PowerStation Downtown Hub</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="flex items-center gap-2 text-gray-900">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  123 Main Street, Downtown, City 12345
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="text-gray-900">+1 (555) 123-4567</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="text-gray-900">downtown@powerstation.com</div>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Operating Hours</h2>
              <p className="text-gray-500 text-sm">Station availability and service hours</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Weekdays (Mon-Fri)</label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Clock className="h-4 w-4 text-gray-400" />
                  6:00 AM - 10:00 PM
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Weekends (Sat-Sun)</label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Clock className="h-4 w-4 text-gray-400" />
                  7:00 AM - 9:00 PM
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services & Amenities */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Services & Amenities</h2>
            <p className="text-gray-500 text-sm">Available services and facilities at your station</p>
          </div>

          <div className="flex flex-wrap gap-4">
            {amenities.map((amenity, index) => {
              const IconComponent = amenity.icon;
              return (
                <div key={index} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border">
                  <IconComponent className={`h-4 w-4 ${amenity.color}`} />
                  <span className="text-gray-700 text-sm font-medium">{amenity.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Station Description */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Station Description</h2>
            <p className="text-gray-500 text-sm">Detailed information about your station</p>
          </div>

          <div className="text-gray-900 leading-relaxed">
            Premier EV charging station located in the heart of downtown. Features 12 charging points with various power levels to accommodate all electric vehicle types.
          </div>
        </div>

        {/* Station Statistics */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Station Statistics</h2>
            <p className="text-gray-500 text-sm">Key performance metrics for your station</p>
          </div>
            <div>lojvslkewriln Hello</div>
          <div className="grid grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}