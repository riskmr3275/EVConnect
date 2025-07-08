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

  const [data,setData]=useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(()=>{
    const fetchStationData=async ()=>
      {
        try {
          const response=await apiConnector("GET",stationEndpoints.GET_ALL_STATION);
          setStations(response.data.data);
        } catch (error) {
          setError(err.message || "Something went wrong");
        }finally
        {
          setLoading(false);
        }
      }
      fetchStationData()
  },[])

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
          <StatusCard title="Total Stations" value={stations.length} icon={<Users className="text-blue-500" />} bgColor="bg-blue-100" />
          <StatusCard title="Active Stations" value={stations.filter(s => s.status === 'Active').length} icon={<RefreshCw className="text-green-500" />} bgColor="bg-green-100" />
          <StatusCard title="Under Maintenance" value={stations.filter(s => s.status === 'Maintenance').length} icon={<AlertTriangle className="text-yellow-500" />} bgColor="bg-yellow-100" />
          <StatusCard title="Inactive Stations" value={stations.filter(s => s.status === 'Inactive').length} icon={<AlertTriangle className="text-red-500" />} bgColor="bg-red-100" />
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <TableHeader text="Location" onClick={() => requestSort('location')} active={sortConfig.key === 'location'} />
                <TableHeader text="Status" onClick={() => requestSort('status')} active={sortConfig.key === 'status'} />
                <TableHeader text="Ports" onClick={() => requestSort('ports')} active={sortConfig.key === 'ports'} />
                <TableHeader text="Active Charging" onClick={() => requestSort('activeCharging')} active={sortConfig.key === 'activeCharging'} />
                <TableHeader text="Station Master" onClick={() => requestSort('stationMaster')} active={sortConfig.key === 'stationMaster'} />
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stations.map(station => (
                
                <tr key={station.id} className="hover:bg-gray-50 border-t">
                  <div>{station}</div>
                  <td className="px-6 py-4">{station?.address}</td>
                  <td className="px-6 py-4"><StatusBadge status={station?.status} /></td>
                  <td className="px-6 py-4">{station?.ports}</td>
                  <td className="px-6 py-4">{station?.activeCharging}</td>
                  <td className="px-6 py-4">{station?.stationMaster}</td>
                  <td className="px-6 py-4">
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  let color = 'gray';
  if (status === 'Active') color = 'green';
  if (status === 'Maintenance') color = 'yellow';
  if (status === 'Inactive') color = 'red';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
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
