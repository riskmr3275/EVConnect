// Keep your existing imports
import React, { useEffect, useState } from 'react';
import {
  Home, Users, FileText, PieChart, Settings, LogOut, ChevronRight,
  Plus, MoreHorizontal, Search, Filter, Download, RefreshCw, AlertTriangle
} from 'lucide-react';
import { addingStation } from '../../services/operations/OwnerApi';
import { useDispatch, useSelector } from "react-redux";
import { apiConnector } from '../../services/apiconnector';
import { stationEndpoints } from '../../services/api';
 
// Sample data (unchanged)
const stationsData = [
  { id: 1, location: '123 Main St, Downtown', status: 'Active', ports: 8, activeCharging: 5, stationMaster: 'John Smith' },
  // ... other station objects
];


export default function EVStationsPage() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [showAddStationModal, setShowAddStationModal] = useState(false);
  const [newStation, setNewStation] = useState({
    location: '',
    totalSlots: '',
    stationMaster: '',
    name: '',
    companyName: '',
    ownerType: 'INDIVIDUAL',
    contact: '',
    address: '',
    district: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStationData = async () => {
      try {
        setLoading(true);
        const response = await apiConnector("GET", stationEndpoints.GET_ALL_STATION);
        if (response.data && response.data.data) {
          setStations(response.data.data);
        } else {
          setStations([]);
        }
      } catch (err) {
        console.error("Error fetching stations:", err);
        setError(err.message || "Something went wrong");
        setStations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStationData();
  }, []);

console.log("object from station",stations)
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  

  const handleAddStation = () => {
    const station = {
      id: stations.length + 1,
      ...newStation,
      status: 'Active',
      activeCharging: 0
    };
    setStations([...stations, station]);
    setNewStation({
      location: '', totalSlots: '', stationMaster: '', name: '', companyName: '',
      ownerType: 'INDIVIDUAL', contact: '', address: '', district: '', state: '', pincode: '', latitude: '', longitude: ''
    });
    dispatch(addingStation(station, token));
    setShowAddStationModal(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 overflow-auto bg-gray-100 text-black">
        <div className="p-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading stations...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 overflow-auto bg-gray-100 text-black">
        <div className="p-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
              <p className="text-red-600 mb-4">Error loading stations: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-100 text-black">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold">Charging Stations</h1>
            <p className="text-sm text-gray-500">Manage and monitor your EV charging stations</p>
          </div>
          <div className="flex gap-2">
            <button className="text-sm bg-white border border-gray-300 hover:bg-gray-100 px-3 py-2 rounded flex items-center">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </button>
            <button className="text-sm bg-white border border-gray-300 hover:bg-gray-100 px-3 py-2 rounded flex items-center">
              <Download className="h-4 w-4 mr-2" /> Export
            </button>
            <button className="text-sm bg-white border border-gray-300 hover:bg-gray-100 px-3 py-2 rounded flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </button>
            <button
              className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center"
              onClick={() => setShowAddStationModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Station
            </button>
          </div>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatusCard 
            title="Total Stations" 
            value={stations.length} 
            icon={<Users className="text-blue-500" />} 
            bgColor="bg-blue-100" 
          />
          <StatusCard 
            title="Active Stations" 
            value={stations.filter(s => s.availableSlots > 0).length} 
            icon={<RefreshCw className="text-green-500" />} 
            bgColor="bg-green-100" 
          />
          <StatusCard 
            title="Full Stations" 
            value={stations.filter(s => s.availableSlots === 0).length} 
            icon={<AlertTriangle className="text-yellow-500" />} 
            bgColor="bg-yellow-100" 
          />
          <StatusCard 
            title="Total Slots" 
            value={stations.reduce((total, station) => total + (station.totalSlots || 0), 0)} 
            icon={<AlertTriangle className="text-purple-500" />} 
            bgColor="bg-purple-100" 
          />
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {stations.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No stations found</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first EV charging station.</p>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
                onClick={() => setShowAddStationModal(true)}
              >
                <Plus className="h-5 w-5" />
                Add Your First Station
              </button>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <TableHeader text="Location" onClick={() => requestSort('location')} active={sortConfig.key === 'location'} />
                  <TableHeader text="Status" onClick={() => requestSort('status')} active={sortConfig.key === 'status'} />
                  <TableHeader text="Total Slots" onClick={() => requestSort('totalSlots')} active={sortConfig.key === 'totalSlots'} />
                  <TableHeader text="Active Charging" onClick={() => requestSort('activeCharging')} active={sortConfig.key === 'activeCharging'} />
                  <TableHeader text="Contact" onClick={() => requestSort('contact')} active={sortConfig.key === 'contact'} />
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stations.map(station => (
                  <tr key={station.id} className="hover:bg-gray-50 border-t">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{station?.name || 'Unnamed Station'}</div>
                        <div className="text-sm text-gray-500">{station?.address}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={station?.availableSlots > 0 ? 'Active' : 'Full'} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium">{station?.totalSlots || 0}</div>
                        <div className="text-gray-500">{station?.availableSlots || 0} available</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{(station?.totalSlots - station?.availableSlots) || 0}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium">{station?.contact || 'N/A'}</div>
                        <div className="text-gray-500">{station?.companyName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Station Modal */}
      {showAddStationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[32rem] max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New EV Station</h2>

            <div className="space-y-4 text-gray-700">
              {/* Repeat for each field */}
              <Input label="Station Name" value={newStation.name} onChange={e => setNewStation({ ...newStation, name: e.target.value })} />
              <Input label="Company Name" value={newStation.companyName} onChange={e => setNewStation({ ...newStation, companyName: e.target.value })} />
              <Select label="Owner Type" value={newStation.ownerType} options={["INDIVIDUAL", "COMPANY"]} onChange={e => setNewStation({ ...newStation, ownerType: e.target.value })} />
              <Input label="Total Slots" type="number" value={newStation.totalSlots} onChange={e => setNewStation({ ...newStation, totalSlots: Number(e.target.value) })} />
              <Input label="Contact Number" value={newStation.contact} onChange={e => setNewStation({ ...newStation, contact: e.target.value })} />
              <Input label="Street Address" value={newStation.address} onChange={e => setNewStation({ ...newStation, address: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <Input label="District" value={newStation.district} onChange={e => setNewStation({ ...newStation, district: e.target.value })} />
                <Input label="State" value={newStation.state} onChange={e => setNewStation({ ...newStation, state: e.target.value })} />
              </div>
              <Input label="Pin Code" value={newStation.pincode} onChange={e => setNewStation({ ...newStation, pincode: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <Input label="Latitude" type="number" value={newStation.latitude} onChange={e => setNewStation({ ...newStation, latitude: parseFloat(e.target.value) })} />
                <Input label="Longitude" type="number" value={newStation.longitude} onChange={e => setNewStation({ ...newStation, longitude: parseFloat(e.target.value) })} />
              </div>

              <div className="flex justify-between text-sm mt-1">
                <button
                  className="text-blue-500 underline"
                  onClick={() => navigator.geolocation.getCurrentPosition((pos) => {
                    const { latitude, longitude } = pos.coords;
                    setNewStation((prev) => ({ ...prev, latitude: latitude.toFixed(6), longitude: longitude.toFixed(6) }));
                  })}
                >
                  📍 Use Current Location
                </button>

                <button
                  className="text-blue-500 underline"
                  onClick={() => window.open('https://www.google.com/maps', '_blank')}
                >
                  🗺️ Open in Map
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
                onClick={() => setShowAddStationModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleAddStation}
                disabled={
                  !newStation.name || !newStation.companyName || !newStation.ownerType || !newStation.contact ||
                  !newStation.address || !newStation.district || !newStation.state || !newStation.pincode ||
                  !newStation.latitude || !newStation.longitude
                }
              >
                Add Station
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Reusable UI Helpers ---
const Input = ({ label, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
      value={value}
      onChange={onChange}
    />
  </div>
);

const Select = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={value} onChange={onChange}>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

function TableHeader({ text, onClick, active }) {
  return (
    <th
      className="px-6 py-3 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center">
        <span className={active ? 'text-blue-600 font-medium' : ''}>{text}</span>
      </div>
    </th>
  );
}

function StatusBadge({ status }) {
  let colorClasses = 'bg-gray-100 text-gray-800';
  
  if (status === 'Active') {
    colorClasses = 'bg-green-100 text-green-800';
  } else if (status === 'Maintenance') {
    colorClasses = 'bg-yellow-100 text-yellow-800';
  } else if (status === 'Inactive' || status === 'Full') {
    colorClasses = 'bg-red-100 text-red-800';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}>
      {status}
    </span>
  );
}

function StatusCard({ title, value, icon, bgColor }) {
  return (
    <div className={`rounded-lg p-4 shadow-sm ${bgColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-md bg-white shadow">{icon}</div>
      </div>
    </div>
  );
}
