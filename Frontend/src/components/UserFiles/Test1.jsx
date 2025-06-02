import React, { useState } from 'react'
import { Calendar, Clock, Check, X, Star } from 'lucide-react'
import { evEndpoints } from '../../services/api';
import axios from 'axios';
import {useSelector} from 'react-redux';
import { useEffect } from 'react';
import {toast} from "react-toastify";
const Test1 = () => {
  const {token} = useSelector((state) => state.auth);
  const {ADD_EV_API,GET_EV_API} = evEndpoints;
  const [evs,setEvs] = useState([]);
  useEffect(() => {
    
    const fetchEvDetails = async () => {
      try {
        const response = await axios.get(GET_EV_API,  {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },);
        setEvs(response.data.data); // If API returns newly added EV
        console.log('EV Data:', evs);
      } catch (error) {
        console.error('Error fetching EV data:', error);
      }
    };

    fetchEvDetails();
  }, [token]);
  // Format the last charged date if it exists
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const [evFormData, setEvFormData] = useState({
    brand: "",
    model: "",
    batteryCapacity: "",
    preferredAcPort: "",
    preferredDcPort: "",
    licensePlate: "",
  });

  const handleEvFormChange = (e) => {
    const { name, value } = e.target;
    setEvFormData({
      ...evFormData,
      [name]: value,
    });
  };

  const handleEvFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(ADD_EV_API, evFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvFormData({})
      // console.log(response.data);
      toast.success("EV details saved successfully!");
      setTimeout(() => {
        window.location.reload(); // 🌀 Reloads the full page
      }, 2000); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to save EV details.");
    }
  };
  

console.log("hello",evFormData)
  const cardClass = "bg-white"
  const borderClass = "border-gray-200"
  const textClass = "text-gray-500"
  const headingClass = "text-gray-900"
  const highlightClass = "bg-blue-500"
  const buttonClass = "bg-black hover:bg-gray-800 cursor-pointer transition duration-300 ease-in-out" 

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
                  <option value="Tesla">Tesla</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Ford">Ford</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Kia">Kia</option>
                  <option value="Audi">Audi</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="BMW">BMW</option>
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
                <label className={`text-sm font-medium mb-1 ${textClass}`}>Preferred AC Port</label>
                <select
                  name="preferredAcPort"
                  value={evFormData.preferredAcPort}
                  onChange={handleEvFormChange}
                  className={`py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}
                  required
                >
                  <option value="">Select Port</option>
                  <option value="BHARAT_AC_001"> BHARAT_AC_001</option>
                  <option value="TYPE_1_AC"> TYPE_1_AC</option>
                  <option value="TYPE_2_AC"> TYPE_2_AC</option>
                  <option value="GB_T_AC">GB_T_AC</option>
                  <option value="CHADEMO"> CHADEMO</option>
                  <option value="TESLA_SUPERCHARGER">TESLA_SUPERCHARGER</option>
                  <option value="Other">Other</option>

                </select>
              </div>

              <div className="flex flex-col">
                <label className={`text-sm font-medium mb-1 ${textClass}`}>Preferred DC Port</label>
                <select
                  name="preferredDcPort"
                  value={evFormData.preferredDcPort}
                  onChange={handleEvFormChange}
                  className={`py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}
                  required
                >
                  <option value="">Select Port</option>
                  <option value="BHARAT_DC_001"> BHARAT_DC_001</option>
                  <option value="CCS1_DC"> CCS1_DC</option>
                  <option value="CCS2_DC"> CCS2_DC</option>
                  <option value="GB_T_DC"> GB_T_DC</option>
                </select>
              </div>
              {/* licen plate */}
              <div className="flex flex-col">
                <label className={`text-sm font-medium mb-1 ${textClass}`}>License Plate</label>
                <input
                  type="text"
                  name="licensePlate"
                  value={evFormData.licensePlate}
                  onChange={handleEvFormChange}
                  placeholder="e.g. MP-12-AB-1234"
                  className={`py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className={`${buttonClass} text-white px-6 py-2 rounded-lg font-medium `}
              >
                Save Vehicle Details
              </button>
            </div>
          </form>
        </div>
        {/* Saved Vehicle details */}
         {/* Saved Vehicle details */}
         <div className="text-2xl font-medium m-2">Your saved vehicle</div>
{evs.length === 0 ? (
  <div className="text-center text-gray-500 text-lg mt-10">
    No EVs added yet.
  </div>
) : (
  evs.map((ev, index) => (
    <div key={index} className="  shadow-sm mb-6">
      
      
      <div className="bg-black text-white p-4 rounded-t-xl">
        <h3 className="text-xl font-bold">{ev.brand} {ev.model}</h3>
        <p className="text-gray-300 text-sm">{ev.licensePlate}</p>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">Battery Capacity</span>
          <span className="font-semibold text-gray-900">{ev.batteryCapacity} kWh</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-black h-2.5 rounded-full" 
            style={{ width: `${ev.batteryCapacity || 70}%` }}
          ></div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-sm">Preferred AC Port</span>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">{ev.preferredAcPort}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Preffered DC Port</span>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">{ev.preferredDcPort}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <span className="text-gray-600 text-sm block mb-1">Last Charged</span>
          <span className="text-gray-900">{formatDate(ev.createdAt)}</span>
        </div>
      </div>

      <div className="bg-gray-50 px-5 py-3 flex justify-between rounded-b-xl">
        <button className="text-gray-700 hover:text-black text-sm font-medium">
          Edit Details
        </button>
        <button className="bg-black text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-gray-800">
          Charge Now
        </button>
      </div>
    </div>
  ))
)}

      </div>
    </main>
  )
}

export default Test1
