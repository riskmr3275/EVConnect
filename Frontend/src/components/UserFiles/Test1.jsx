import React, { useState } from 'react'
import { Calendar, Clock, Check, X, Star } from 'lucide-react'

const Test1 = () => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const [evFormData, setEvFormData] = useState({
    brand: "",
    model: "",
    batteryCapacity: "",
    chargingPort: "",
    chargingSpeed: "",
  });

  const handleEvFormChange = (e) => {
    const { name, value } = e.target;
    setEvFormData({
      ...evFormData,
      [name]: value,
    });
  };

  const handleEvFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log("EV Form Data:", evFormData);
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
        <h2 className={`text-2xl font-bold mb-6 ${headingClass}`}>Add Your EV</h2>
        <div className={`${cardClass} rounded-lg shadow-sm p-6 border ${borderClass}`}>
          <form onSubmit={handleEvFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className={`text-sm font-medium mb-1 ${textClass}`}>EV Brand</label>
                <select
                  name="brand"
                  value={evFormData.brand}
                  onChange={handleEvFormChange}
                  className={`py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}
                  required
                >
                  <option value="">Select Brand</option>
                  <option value="tesla">Tesla</option>
                  <option value="nissan">Nissan</option>
                  <option value="chevrolet">Chevrolet</option>
                  <option value="ford">Ford</option>
                  <option value="hyundai">Hyundai</option>
                  <option value="kia">Kia</option>
                  <option value="audi">Audi</option>
                  <option value="volkswagen">Volkswagen</option>
                  <option value="bmw">BMW</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className={`text-sm font-medium mb-1 ${textClass}`}>EV Model</label>
                <input
                  type="text"
                  name="model"
                  value={evFormData.model}
                  onChange={handleEvFormChange}
                  placeholder="e.g. Model 3, Leaf, Bolt"
                  className={`py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className={`text-sm font-medium mb-1 ${textClass}`}>Battery Capacity (kWh)</label>
                <input
                  type="number"
                  name="batteryCapacity"
                  value={evFormData.batteryCapacity}
                  onChange={handleEvFormChange}
                  placeholder="e.g. 75"
                  className={`py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className={`text-sm font-medium mb-1 ${textClass}`}>Charging Port Type</label>
                <select
                  name="chargingPort"
                  value={evFormData.chargingPort}
                  onChange={handleEvFormChange}
                  className={`py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}
                  required
                >
                  <option value="">Select Port Type</option>
                  <option value="Type-2">Type-2</option>
                  <option value="CCS">CCS</option>
                  <option value="CHAdeMO">CHAdeMO</option>
                  <option value="Tesla">Tesla Connector</option>
                  <option value="Type-1">Type-1 (J1772)</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className={`text-sm font-medium mb-1 ${textClass}`}>Preferred Charging Speed</label>
                <select
                  name="chargingSpeed"
                  value={evFormData.chargingSpeed}
                  onChange={handleEvFormChange}
                  className={`py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}
                  required
                >
                  <option value="">Select Charging Speed</option>
                  <option value="slow">Slow (AC, up to 7.4 kW)</option>
                  <option value="fast">Fast (AC, 7.4-22 kW)</option>
                  <option value="rapid">Rapid (DC, 50+ kW)</option>
                  <option value="ultra">Ultra Rapid (DC, 100+ kW)</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className={`${buttonClass} text-white px-6 py-2 rounded-lg font-medium`}
              >
                Save Vehicle Details
              </button>
            </div>
          </form>
        </div>

      </div>
    </main>
  )
}

export default Test1
