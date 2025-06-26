import React from "react";
import { Download, Zap, MessageSquare, CheckCircle } from "lucide-react";

const logs = [
  {
    timestamp: "2024-01-20 15:30:25",
    type: "Charging Session",
    user: "User #1234",
    charger: "CH-O02",
    action: "Session Started",
    duration: "45 min",
    energy: "32.5 kWh",
    status: "Completed",
  },
  {
    timestamp: "2024-01-20 15:15:10",
    type: "Maintenance",
    user: "John Smith",
    charger: "CH-O05",
    action: "Status Changed to Maintenance",
    duration: "-",
    energy: "-",
    status: "Active",
  },
  {
    timestamp: "2024-01-20 14:45:33",
    type: "Customer Support",
    user: "Sarah Johnson",
    charger: "-",
    action: "Ticket TK-O01 Resolved",
    duration: "-",
    energy: "-",
    status: "Resolved",
  },
];

const Badge = ({ status }) => {
  const color =
    status === "Completed"
      ? "bg-blue-100 text-blue-700"
      : status === "Active"
      ? "bg-black text-white"
      : "bg-green-100 text-green-700";
  return (
    <span className={`text-sm px-2 py-1 rounded-full font-medium ${color}`}>
      {status}
    </span>
  );
};

export default function EVAccessLogs() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl font-semibold">📱 EV Station Management</span>
      </div>

      {/* Access Logs and Reports */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Access Logs & Reports</h2>
          <p className="text-sm text-gray-600">
            View and download station activity logs and usage reports
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md shadow">
          <Download size={16} />
          Download Report
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-md shadow border">
          <p className="text-gray-500 text-sm">Total Sessions Today</p>
          <h3 className="text-2xl font-bold">89</h3>
          <p className="text-green-600 text-sm">+12% from yesterday</p>
        </div>
        <div className="bg-white p-4 rounded-md shadow border">
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Energy Dispensed <Zap size={14} className="text-green-500" />
          </p>
          <h3 className="text-2xl font-bold">1,247 kWh</h3>
          <p className="text-green-600 text-sm">+8% from yesterday</p>
        </div>
        <div className="bg-white p-4 rounded-md shadow border">
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Support Tickets <MessageSquare size={14} className="text-orange-500" />
          </p>
          <h3 className="text-2xl font-bold">3</h3>
          <p className="text-gray-600 text-sm">2 resolved today</p>
        </div>
        <div className="bg-white p-4 rounded-md shadow border">
          <p className="text-gray-500 text-sm flex items-center gap-1">
            System Uptime <CheckCircle size={14} className="text-purple-500" />
          </p>
          <h3 className="text-2xl font-bold">99.8%</h3>
          <p className="text-gray-600 text-sm">Last 24 hours</p>
        </div>
      </div>

      {/* Activity Logs */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Activity Logs</h3>
        <p className="text-sm text-gray-600 mb-4">Detailed logs of all station activities and events</p>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search logs..."
            className="border px-3 py-2 rounded-md w-full md:w-1/3"
          />
          <select className="border px-2 py-2 rounded-md">
            <option>All Types</option>
          </select>
          <select className="border px-2 py-2 rounded-md">
            <option>Today</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white border shadow rounded-md">
            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Type</th>
                <th className="p-3">User</th>
                <th className="p-3">Charger</th>
                <th className="p-3">Action</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Energy</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {logs.map((log, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">{log.timestamp}</td>
                  <td className="p-3">{log.type}</td>
                  <td className="p-3">{log.user}</td>
                  <td className="p-3">{log.charger}</td>
                  <td className="p-3">{log.action}</td>
                  <td className="p-3">{log.duration}</td>
                  <td className="p-3">{log.energy}</td>
                  <td className="p-3">
                    <Badge status={log.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
