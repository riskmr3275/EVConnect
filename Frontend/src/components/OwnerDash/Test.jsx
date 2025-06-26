// ChargingStations.jsx
import React from "react";

const stations = [
  {
    name: "Downtown Station",
    address: "123 Main St, Downtown",
    type: "DC Fast",
    ports: 4,
    manager: "Alice Johnson",
    sessions: 156,
    revenue: 2450.50,
    status: "online",
  },
  {
    name: "Mall Parking",
    address: "456 Shopping Blvd, Mall District",
    type: "AC Level 2",
    ports: 8,
    manager: "Bob Smith",
    sessions: 203,
    revenue: 1890.25,
    status: "online",
  },
  {
    name: "Highway Rest Stop",
    address: "789 Highway 101, Mile 45",
    type: "DC Fast",
    ports: 6,
    manager: "Unassigned",
    sessions: 98,
    revenue: 3200.75,
    status: "offline",
  },
  {
    name: "Office Complex",
    address: "321 Business Park Dr",
    type: "AC Level 2",
    ports: 12,
    manager: "Carol Davis",
    sessions: 134,
    revenue: 1650.0,
    status: "maintenance",
  },
];

const EVStationsPage = () => {
  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6 w-full">
        <div>
          <h1 className="text-3xl font-bold">Charging Stations</h1>
          <p className="text-gray-500">Manage your EV charging station network</p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded">+ Add Station</button>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search stations by name or location..."
          className="border rounded px-4 py-2 w-full"
        />
        <select className="border rounded px-4 py-2">
          <option>All Stations</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stations.map((station, i) => (
          <div key={i} className="bg-white border p-4 rounded shadow relative">
            <span className={`absolute top-4 right-4 px-2 py-1 text-xs rounded-full ${
              station.status === "online"
                ? "bg-green-100 text-green-700"
                : station.status === "offline"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
            </span>
            <h2 className="font-bold text-lg mb-1">{station.name}</h2>
            <p className="text-sm text-gray-500">{station.address}</p>
            <div className="text-sm mt-2 space-y-1">
              <p><strong>Type:</strong> {station.type}</p>
              <p><strong>Ports:</strong> {station.ports}</p>
              <p><strong>Manager:</strong> {station.manager}</p>
              <p><strong>Sessions:</strong> {station.sessions}</p>
            </div>
            <p className="text-green-600 font-bold mt-2">${station.revenue.toFixed(2)}</p>
            <div className="flex gap-2 mt-4">
              <button className="px-3 py-1 border rounded text-sm">👁 View</button>
              <button className="px-3 py-1 border rounded text-sm">✏️ Edit</button>
              <button className="px-3 py-1 border rounded text-sm">⛔</button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Stations</p>
          <p className="text-xl font-bold">4</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Online Stations</p>
          <p className="text-xl font-bold">2</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Ports</p>
          <p className="text-xl font-bold">30</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Unassigned Stations</p>
          <p className="text-xl font-bold">1</p>
        </div>
      </div>
    </div>
  );
};

export default EVStationsPage;
