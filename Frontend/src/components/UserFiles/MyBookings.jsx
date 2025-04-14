import React, { useState } from 'react';

const MyBookings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const user = {
    totalBookings: 24,
    upcomingBookings: 5,
    completedSessions: 15,
    cancelledSessions: 4,
  };

  const cardClass = 'bg-white';
  const borderClass = 'border-gray-200';
  const textClass = 'text-gray-500';
  const headingClass = 'text-gray-900';
  const buttonClass = 'bg-blue-500';
  const highlightClass = 'bg-blue-500';

  return (
    <main className="flex-1 overflow-y-auto py-6 px-4 md:px-6">
      <div className="container mx-auto">
        <h2 className={`text-2xl font-bold mb-6 ${headingClass}`}>My Bookings</h2>
        
        {/* Upcoming Bookings Section */}
        <div className={`${cardClass} rounded-lg shadow-sm p-4 border ${borderClass} mb-6`}>
          <h3 className={`font-semibold ${headingClass} mb-4`}>Upcoming Bookings</h3>

          <div
            className={`border-l-4 border-indigo-500 pl-4 py-2 mb-4 ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            } rounded-r-lg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className={`font-medium ${headingClass}`}>EcoCharge Central</h4>
                <p className={`text-sm ${textClass}`}>Today, 7:00 PM - 8:00 PM</p>
                <p className={`text-sm ${textClass}`}>Connector: Type-2</p>
              </div>
              <div className="flex space-x-2">
                <button
                  className={`text-sm px-3 py-1 rounded-lg border ${borderClass}`}
                >
                  Reschedule
                </button>
                <button className="text-sm px-3 py-1 rounded-lg bg-red-100 text-red-600">
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div
            className={`border-l-4 border-indigo-500 pl-4 py-2 ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            } rounded-r-lg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className={`font-medium ${headingClass}`}>ElectriDrive Hub</h4>
                <p className={`text-sm ${textClass}`}>Tomorrow, 2:00 PM - 3:30 PM</p>
                <p className={`text-sm ${textClass}`}>Connector: CCS</p>
              </div>
              <div className="flex space-x-2">
                <button
                  className={`text-sm px-3 py-1 rounded-lg border ${borderClass}`}
                >
                  Reschedule
                </button>
                <button className="text-sm px-3 py-1 rounded-lg bg-red-100 text-red-600">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Past Bookings Section */}
        <div className={`${cardClass} rounded-lg shadow-sm p-4 border ${borderClass}`}>
          <h3 className={`font-semibold ${headingClass} mb-4`}>Past Bookings</h3>

          <div
            className={`border-l-4 border-gray-300 pl-4 py-2 mb-4 ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            } rounded-r-lg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className={`font-medium ${headingClass}`}>GreenPower Station</h4>
                <p className={`text-sm ${textClass}`}>April 10, 2025, 10:00 AM - 11:30 AM</p>
                <p className={`text-sm ${textClass}`}>Connector: CHAdeMO • 32.5 kWh charged</p>
              </div>
              <div className="flex space-x-2">
                <button
                  className={`text-sm px-3 py-1 rounded-lg bg-indigo-100 ${
                    darkMode ? 'bg-indigo-900 bg-opacity-30 text-indigo-300' : 'text-indigo-600'
                  }`}
                >
                  Book Again
                </button>
              </div>
            </div>
          </div>

          <div
            className={`border-l-4 border-gray-300 pl-4 py-2 mb-4 ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            } rounded-r-lg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className={`font-medium ${headingClass}`}>EcoCharge Central</h4>
                <p className={`text-sm ${textClass}`}>April 7, 2025, 6:30 PM - 8:00 PM</p>
                <p className={`text-sm ${textClass}`}>Connector: Type-2 • 45.2 kWh charged</p>
              </div>
              <div className="flex space-x-2">
                <button
                  className={`text-sm px-3 py-1 rounded-lg bg-indigo-100 ${
                    darkMode ? 'bg-indigo-900 bg-opacity-30 text-indigo-300' : 'text-indigo-600'
                  }`}
                >
                  Book Again
                </button>
              </div>
            </div>
          </div>

          <div
            className={`border-l-4 border-red-500 pl-4 py-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-r-lg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className={`font-medium ${headingClass}`}>ElectriDrive Hub</h4>
                <p className={`text-sm ${textClass}`}>April 5, 2025, 2:00 PM - 3:30 PM</p>
                <p className={`text-sm text-red-500`}>Cancelled</p>
              </div>
              <div className="flex space-x-2">
                <button
                  className={`text-sm px-3 py-1 rounded-lg bg-indigo-100 ${
                    darkMode ? 'bg-indigo-900 bg-opacity-30 text-indigo-300' : 'text-indigo-600'
                  }`}
                >
                  Book Again
                </button>
              </div>
            </div>
          </div>

          {/* View All Bookings Button */}
          <div className="mt-4 text-center">
            <button className={`text-sm px-4 py-2 ${buttonClass} text-white rounded-lg`}>
              View All Bookings
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyBookings;
