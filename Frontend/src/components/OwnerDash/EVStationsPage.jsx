import React, { useState } from 'react';
import { Home, Users, FileText, PieChart, Settings, LogOut, ChevronRight, Plus, MoreHorizontal, Search, Filter, Download, RefreshCw, AlertTriangle } from 'lucide-react';

// Sample data for the stations
const stationsData = [
  { id: 1, location: '123 Main St, Downtown', status: 'Active', ports: 8, activeCharging: 5, stationMaster: 'John Smith' },
  { id: 2, location: '456 Park Ave, Uptown', status: 'Active', ports: 6, activeCharging: 3, stationMaster: 'Emily Johnson' },
  { id: 3, location: '789 West Blvd, Westside', status: 'Maintenance', ports: 10, activeCharging: 0, stationMaster: 'Michael Brown' },
  { id: 4, location: '321 East St, Eastside', status: 'Active', ports: 4, activeCharging: 2, stationMaster: 'Sarah Davis' },
  { id: 5, location: '555 North Ave, Northside', status: 'Inactive', ports: 6, activeCharging: 0, stationMaster: 'Robert Wilson' },
  { id: 6, location: '777 South St, Southside', status: 'Active', ports: 8, activeCharging: 6, stationMaster: 'Jennifer Lee' },
  { id: 7, location: '100 Central Plaza, Downtown', status: 'Active', ports: 12, activeCharging: 8, stationMaster: 'David Miller' }
];

export default function EVStationsPage() {
  const [stations, setStations] = useState(stationsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [showAddStationModal, setShowAddStationModal] = useState(false);
  const [newStation, setNewStation] = useState({
    location: '',
    ports: '',
    stationMaster: ''
  });

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter stations based on search term
  const filteredStations = stations.filter(station => 
    station.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.stationMaster.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort stations
  const sortedStations = [...filteredStations].sort((a, b) => {
    if (sortConfig.key === null) return 0;
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Add new station handler
  const handleAddStation = () => {
    const station = {
      id: stations.length + 1,
      ...newStation,
      status: 'Active',
      activeCharging: 0
    };
    setStations([...stations, station]);
    setNewStation({ location: '', ports: '', stationMaster: '' });
    setShowAddStationModal(false);
  };

  return (
    <div className="flex-1 overflow-auto bg-black text-white">
      
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top navigation */}
        <div className="bg-black p-4 border-b border-gray-800 flex items-center justify-between">
              
          
          
        </div>
        
        {/* Stations content */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-bold">Charging Stations</h1>
              <p className="text-sm text-gray-400">Manage and monitor your EV charging stations</p>
            </div>
            <div className="flex gap-2">
              <button className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button 
                className="text-sm bg-green-600 hover:bg-green-700 px-3 py-2 rounded flex items-center"
                onClick={() => setShowAddStationModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Station
              </button>
            </div>
          </div>
          
          {/* Status Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatusCard 
              title="Total Stations" 
              value={stations.length} 
              icon={<Users className="h-5 w-5 text-blue-400" />}
              bgColor="bg-blue-900/20"
              borderColor="border-blue-700"
            />
            <StatusCard 
              title="Active Stations" 
              value={stations.filter(s => s.status === 'Active').length} 
              icon={<RefreshCw className="h-5 w-5 text-green-400" />}
              bgColor="bg-green-900/20"
              borderColor="border-green-700"
            />
            <StatusCard 
              title="Under Maintenance" 
              value={stations.filter(s => s.status === 'Maintenance').length} 
              icon={<AlertTriangle className="h-5 w-5 text-yellow-400" />}
              bgColor="bg-yellow-900/20"
              borderColor="border-yellow-700"
            />
            <StatusCard 
              title="Inactive Stations" 
              value={stations.filter(s => s.status === 'Inactive').length} 
              icon={<AlertTriangle className="h-5 w-5 text-red-400" />}
              bgColor="bg-red-900/20"
              borderColor="border-red-700"
            />
          </div>
          
          {/* Stations Table */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900">
                  <TableHeader text="Location" onClick={() => requestSort('location')} active={sortConfig.key === 'location'} />
                  <TableHeader text="Status" onClick={() => requestSort('status')} active={sortConfig.key === 'status'} />
                  <TableHeader text="Ports" onClick={() => requestSort('ports')} active={sortConfig.key === 'ports'} />
                  <TableHeader text="Active Charging" onClick={() => requestSort('activeCharging')} active={sortConfig.key === 'activeCharging'} />
                  <TableHeader text="Station Master" onClick={() => requestSort('stationMaster')} active={sortConfig.key === 'stationMaster'} />
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {sortedStations.map((station) => (
                  <tr key={station.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{station.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={station.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {station.ports}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {station.activeCharging}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{station.stationMaster}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-white">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-400">
              Showing <span className="font-medium">{sortedStations.length}</span> of <span className="font-medium">{stations.length}</span> stations
            </div>
            <div className="flex">
              <button className="px-3 py-1 bg-gray-800 rounded-l text-gray-400 hover:bg-gray-700">Previous</button>
              <button className="px-3 py-1 bg-gray-700 text-white">1</button>
              <button className="px-3 py-1 bg-gray-800 text-gray-400 hover:bg-gray-700">2</button>
              <button className="px-3 py-1 bg-gray-800 rounded-r text-gray-400 hover:bg-gray-700">Next</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Station Modal */}
      {showAddStationModal && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 w-full">
    <div className="bg-black border border-white/20 rounded-xl p-6 w-[30rem] max-h-[90vh] overflow-y-auto shadow-2xl">
      <h2 className="text-xl font-semibold text-white mb-6">Add New EV Station</h2>

      <div className="space-y-4 text-white">
        <div>
          <label className="block text-sm font-medium mb-1">Station Name</label>
          <input
            type="text"
            className="w-full bg-black border border-white/30 rounded-md px-3 py-2 text-sm placeholder-white/50"
            value={newStation.name || ''}
            onChange={(e) => setNewStation({ ...newStation, name: e.target.value })}
            placeholder="e.g. EV Station Alpha"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Company Name</label>
          <input
            type="text"
            className="w-full bg-black border border-white/30 rounded-md px-3 py-2 text-sm placeholder-white/50"
            value={newStation.companyName || ''}
            onChange={(e) => setNewStation({ ...newStation, companyName: e.target.value })}
            placeholder="e.g. Green Energy Corp"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Owner Type</label>
          <select
            className="w-full bg-black border border-white/30 rounded-md px-3 py-2 text-sm"
            value={newStation.ownerType || 'INDIVIDUAL'}
            onChange={(e) => setNewStation({ ...newStation, ownerType: e.target.value })}
          >
            <option value="INDIVIDUAL">INDIVIDUAL</option>
            <option value="COMPANY">COMPANY</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact Number</label>
          <input
            type="text"
            className="w-full bg-black border border-white/30 rounded-md px-3 py-2 text-sm placeholder-white/50"
            value={newStation.contact || ''}
            onChange={(e) => setNewStation({ ...newStation, contact: e.target.value })}
            placeholder="e.g. +91-9876543210"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Street Address</label>
          <input
            type="text"
            className="w-full bg-black border border-white/30 rounded-md px-3 py-2 text-sm placeholder-white/50"
            value={newStation.address || ''}
            onChange={(e) => setNewStation({ ...newStation, address: e.target.value })}
            placeholder="e.g. 123 Green Lane"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">District</label>
            <input
              type="text"
              className="w-full bg-black border border-white/30 rounded-md px-3 py-2 text-sm placeholder-white/50"
              value={newStation.district || ''}
              onChange={(e) => setNewStation({ ...newStation, district: e.target.value })}
              placeholder="e.g. Ranchi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              className="w-full bg-black border border-white/30 rounded-md px-3 py-2 text-sm placeholder-white/50"
              value={newStation.state || ''}
              onChange={(e) => setNewStation({ ...newStation, state: e.target.value })}
              placeholder="e.g. Jharkhand"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pin Code</label>
          <input
            type="text"
            className="w-full bg-black border border-white/30 rounded-md px-3 py-2 text-sm placeholder-white/50"
            value={newStation.pincode || ''}
            onChange={(e) => setNewStation({ ...newStation, pincode: e.target.value })}
            placeholder="e.g. 825401"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input
              type="number"
              className="w-full bg-black border border-white/30 rounded-md px-3 py-2 text-sm placeholder-white/50"
              value={newStation.latitude || ''}
              onChange={(e) => setNewStation({ ...newStation, latitude: e.target.value })}
              placeholder="e.g. 23.3449"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input
              type="number"
              className="w-full bg-black border border-white/30 rounded-md px-3 py-2 text-sm placeholder-white/50"
              value={newStation.longitude || ''}
              onChange={(e) => setNewStation({ ...newStation, longitude: e.target.value })}
              placeholder="e.g. 85.3096"
            />
          </div>
        </div>

        <div className="flex justify-between text-sm mt-1">
          <button
            className="text-white underline hover:text-gray-300"
            onClick={() => {
              navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                setNewStation((prev) => ({
                  ...prev,
                  latitude: latitude.toFixed(6),
                  longitude: longitude.toFixed(6),
                }));
              });
            }}
          >
            📍 Use Current Location
          </button>

          <button
            className="text-white underline hover:text-gray-300"
            onClick={() => window.open('https://www.google.com/maps', '_blank')}
          >
            🗺️ Open in Map
          </button>
        </div>
      </div>

      <div className="flex justify-end mt-6 space-x-3">
        <button
          className="px-4 py-2 border border-white/40 text-white rounded-md hover:bg-white hover:text-black transition"
          onClick={() => setShowAddStationModal(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition"
          onClick={handleAddStation}
          disabled={
            !newStation.name ||
            !newStation.companyName ||
            !newStation.ownerType ||
            !newStation.contact ||
            !newStation.address ||
            !newStation.district ||
            !newStation.state ||
            !newStation.pincode ||
            !newStation.latitude ||
            !newStation.longitude
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

// Helper Components
function SidebarItem({ icon, text, active = false }) {
  return (
    <div className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${active ? 'bg-gray-800' : 'hover:bg-gray-800'}`}>
      <div className="mr-3 text-gray-400">{icon}</div>
      <span className={active ? 'text-white' : 'text-gray-400'}>{text}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  let bgColor = 'bg-gray-600';
  if (status === 'Active') bgColor = 'bg-green-500';
  if (status === 'Maintenance') bgColor = 'bg-yellow-500';
  if (status === 'Inactive') bgColor = 'bg-gray-500';
  
  return (
    <span className={`${bgColor} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
      {status}
    </span>
  );
}

function TableHeader({ text, onClick, active }) {
  return (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
      onClick={onClick}
    >
      <div className="flex items-center">
        <span className={active ? 'text-blue-400' : ''}>{text}</span>
        {active && (
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
    </th>
  );
}

function StatusCard({ title, value, icon, bgColor, borderColor }) {
  return (
    <div className={`border ${borderColor} ${bgColor} rounded-lg p-4`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-md bg-gray-800/50">
          {icon}
        </div>
      </div>
    </div>
  );
}