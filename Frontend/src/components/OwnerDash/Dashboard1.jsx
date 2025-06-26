import React from "react";

const Dashboard1 = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome back! Here's your EV network overview.</p>
        </div>
        <div className="flex gap-3">
          <button className="border px-4 py-1 rounded-md text-sm">Last 30 days</button>
          <button className="bg-black text-white px-4 py-1 rounded-md text-sm">Add Station</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Stations", value: "24", subtitle: "+2 from last month" },
          { title: "Active Ports", value: "156", subtitle: "85% utilization rate" },
          { title: "Monthly Revenue", value: "$28,450", subtitle: "+12% from last month" },
          { title: "Total Employees", value: "18", subtitle: "2 stations unassigned" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-sm text-gray-500">{item.title}</h2>
            <p className="text-xl font-semibold">{item.value}</p>
            <p className="text-xs text-green-500 mt-1">{item.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Revenue & Status Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Revenue Overview */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Revenue Overview</h2>
          <p className="text-sm text-gray-500 mb-4">Monthly revenue and charging sessions</p>
          <div className="h-52 w-full bg-gray-100 flex items-end gap-2 px-4 pb-2">
            {[13000, 15000, 18000, 21000, 24000, 27000].map((val, idx) => (
              <div key={idx} className="flex-1 bg-emerald-600 rounded-sm" style={{ height: `${val / 300}px` }} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 px-4 mt-2">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        {/* Station Status */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Station Status Distribution</h2>
          <p className="text-sm text-gray-500 mb-4">Current status of all charging stations</p>
          <div className="flex justify-center items-center">
            <div className="w-40 h-40 rounded-full bg-green-400 relative">
              <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full"></div>
              <div className="absolute bottom-3 right-3 w-5 h-5 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
          <div className="flex justify-center gap-6 text-sm mt-4">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span>Online: 85</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full"></span>Offline: 8</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded-full"></span>Maintenance: 7</span>
          </div>
        </div>
      </div>

      {/* Transactions & Alerts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Transactions */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Recent Transactions</h2>
          <p className="text-sm text-gray-500 mb-4">Latest charging session transactions</p>
          {[
            { name: "Downtown Station", id: "TXN001", time: "2 hours ago", amount: "$45.5", status: "success" },
            { name: "Mall Parking", id: "TXN002", time: "3 hours ago", amount: "$32.75", status: "success" },
            { name: "Highway Rest Stop", id: "TXN003", time: "4 hours ago", amount: "$67.2", status: "failed" },
            { name: "Office Complex", id: "TXN004", time: "5 hours ago", amount: "$28.9", status: "success" },
          ].map((txn, idx) => (
            <div key={idx} className="flex justify-between items-center mb-2">
              <div>
                <p className="font-medium">{txn.name}</p>
                <p className="text-xs text-gray-500">{txn.id} · {txn.time}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{txn.amount}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${txn.status === 'success' ? 'bg-black text-white' : 'bg-red-100 text-red-600'}`}>{txn.status}</span>
              </div>
            </div>
          ))}
          <button className="text-blue-600 text-sm mt-2">View All Transactions</button>
        </div>

        {/* Alerts */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">System Alerts</h2>
          <p className="text-sm text-gray-500 mb-4">Important notifications and updates</p>
          {[
            { text: "Station 'Highway Rest Stop' is offline", time: "10 min ago", type: "error" },
            { text: "Low inventory: Type 2 cables at Mall Parking", time: "1 hour ago", type: "warn" },
            { text: "Maintenance scheduled for Downtown Station", time: "2 hours ago", type: "info" },
          ].map((alert, idx) => (
            <div key={idx} className="mb-3">
              <div className={`flex items-start gap-2 p-2 rounded-md border ${alert.type === 'error' ? 'border-red-400 bg-red-50' : alert.type === 'warn' ? 'border-yellow-400 bg-yellow-50' : 'border-blue-400 bg-blue-50'}`}>
                <div className="text-sm">{alert.text}</div>
              </div>
              <p className="text-xs text-gray-400 ml-2">{alert.time}</p>
            </div>
          ))}
          <button className="text-blue-600 text-sm">View All Alerts</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard1;
