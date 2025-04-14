import React, { useState } from 'react'
import { Calendar, Clock, Check, X, Star } from 'lucide-react'

const Test = () => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const user = {
    totalBookings: 24,
    upcomingBookings: 5,
    completedSessions: 15,
    cancelledSessions: 4,
  }

  const cardClass = "bg-white"
  const borderClass = "border-gray-200"
  const textClass = "text-gray-500"
  const headingClass = "text-gray-900"
  const highlightClass = "bg-blue-500"
  const buttonClass = "bg-blue-500"

  return (
    <main className="flex-1 overflow-y-auto py-6 px-4 md:px-6">
      <div className="container mx-auto">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={`${cardClass} rounded-lg shadow-sm p-4 border ${borderClass}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${textClass}`}>Total Bookings</p>
                <p className={`text-2xl font-semibold ${headingClass}`}>{user.totalBookings}</p>
              </div>
              <div className={`rounded-full p-2 ${highlightClass} bg-opacity-10`}>
                <Calendar className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className={`${cardClass} rounded-lg shadow-sm p-4 border ${borderClass}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${textClass}`}>Upcoming Bookings</p>
                <p className={`text-2xl font-semibold ${headingClass}`}>{user.upcomingBookings}</p>
              </div>
              <div className={`rounded-full p-2 ${highlightClass} bg-opacity-10`}>
                <Clock className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className={`${cardClass} rounded-lg shadow-sm p-4 border ${borderClass}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${textClass}`}>Completed Sessions</p>
                <p className={`text-2xl font-semibold ${headingClass}`}>{user.completedSessions}</p>
              </div>
              <div className={`rounded-full p-2 ${highlightClass} bg-opacity-10`}>
                <Check className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className={`${cardClass} rounded-lg shadow-sm p-4 border ${borderClass}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${textClass}`}>Cancelled Sessions</p>
                <p className={`text-2xl font-semibold ${headingClass}`}>{user.cancelledSessions}</p>
              </div>
              <div className={`rounded-full p-2 ${highlightClass} bg-opacity-10`}>
                <X className="text-white" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className={`${cardClass} rounded-lg shadow-sm p-4 border ${borderClass} mb-8`}>
          <h3 className={`text-lg font-semibold mb-4 ${headingClass}`}>Personalized Recommendations</h3>
          <div className="space-y-4">
            <div className={`flex items-center p-3 rounded-lg bg-indigo-50 ${darkMode ? 'bg-indigo-900 bg-opacity-30' : ''}`}>
              <Star className="text-indigo-500 mr-3" size={20} />
              <div>
                <p className={`font-medium ${headingClass}`}>Most visited station: EcoCharge Central</p>
                <p className={`text-sm ${textClass}`}>You charged here 8 times in the last month</p>
              </div>
            </div>

            <div className={`flex items-center p-3 rounded-lg bg-indigo-50 ${darkMode ? 'bg-indigo-900 bg-opacity-30' : ''}`}>
              <Clock className="text-indigo-500 mr-3" size={20} />
              <div>
                <p className={`font-medium ${headingClass}`}>You usually charge at 7 PM – want to book in advance?</p>
                <button className={`mt-2 text-sm ${buttonClass} text-white px-3 py-1 rounded-md`}>Book Now</button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className={`${cardClass} rounded-lg shadow-sm p-4 border ${borderClass}`}>
          <h3 className={`text-lg font-semibold mb-4 ${headingClass}`}>Additional Preferences</h3>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className={`text-sm font-medium mb-1 ${textClass}`}>Frequent Travel Routes</label>
              <select className={`py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}>
                <option>Home ↔ Office (12km)</option>
                <option>Home ↔ Shopping Mall (5km)</option>
                <option>Office ↔ Gym (3km)</option>
                <option>+ Add new route</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className={`text-sm font-medium mb-1 ${textClass}`}>Favorite Stations</label>
              <div className="flex flex-wrap gap-2">
                <span className={`py-1 px-3 rounded-full text-sm ${borderClass} border inline-flex items-center`}>
                  EcoCharge Central
                  <button className="ml-2"><X size={14} /></button>
                </span>
                <span className={`py-1 px-3 rounded-full text-sm ${borderClass} border inline-flex items-center`}>
                  ElectriDrive Hub
                  <button className="ml-2"><X size={14} /></button>
                </span>
                <button className={`py-1 px-3 rounded-full text-sm ${highlightClass} text-white`}>+ Add</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

export default Test
