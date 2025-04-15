import React from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';

// Sample data
const monthlyData = [
  { name: 'Jan', value: 230 },
  { name: 'Feb', value: 290 },
  { name: 'Mar', value: 350 },
  { name: 'Apr', value: 240 },
  { name: 'May', value: 320 },
  { name: 'Jun', value: 280 },
  { name: 'Jul', value: 230 },
  { name: 'Aug', value: 220 },
  { name: 'Sep', value: 270 },
  { name: 'Oct', value: 340 },
  { name: 'Nov', value: 380 },
  { name: 'Dec', value: 420 }
];

const recentTransactions = [
  { id: 'JD', name: 'John D.', location: 'Downtown', type: 'Type 2', amount: 12.50, time: '2 mins ago' },
  { id: 'SM', name: 'Sarah M.', location: 'Uptown', type: 'CCS', amount: 24.75, time: '15 mins ago' },
  { id: 'RJ', name: 'Robert J.', location: 'Westside', type: 'CHAdeMO', amount: 18.30, time: '45 mins ago' },
  { id: 'EK', name: 'Emily K.', location: 'Downtown', type: 'Type 2', amount: 9.15, time: '1 hour ago' },
  { id: 'MP', name: 'Michael P.', location: 'Uptown', type: 'CCS', amount: 31.20, time: '2 hours ago' }
];

export default function OwnDashboardPage() {
  return (
    <div className="flex-1 overflow-auto bg-black text-white">
      {/* Top nav */}
      <div className="bg-black p-4 border-b border-gray-800 flex items-center justify-between">
         
      </div>

      {/* Content */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cards */}
        <Card title="Active Charging Sessions" value="24" percentage="+12%" timeframe="from last hour" />
        <Card title="Revenue Today" value="$4,289" percentage="+20.1%" timeframe="from yesterday" isDollar />
        <Card title="Total Employees" value="42" percentage="+3" timeframe="since last week" />

        {/* Chart */}
        <div className="md:col-span-2 bg-gray-900 rounded-lg p-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
              <Bar dataKey="value" fill="#FFFFFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Transactions */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-1">Recent Transactions</h2>
          <p className="text-sm text-gray-400 mb-4">Last 5 charging transactions across all stations</p>

          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-sm mr-3">
                    {transaction.id}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{transaction.name}</p>
                    <p className="text-xs text-gray-400">{transaction.location} · {transaction.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${transaction.amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{transaction.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gauge Chart */}
        <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-16 border-blue-500 border-t-green-500 border-r-green-500 border-b-green-500"></div>
        </div>

        {/* Stations */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-1">Your Stations</h2>
          <p className="text-sm text-gray-400 mb-4">Manage and monitor your EV charging stations</p>

          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-medium">EV Station Downtown</h3>
                <span className="inline-block bg-green-500 text-xs rounded px-2 py-0.5 mt-1">Active</span>
              </div>
              <button className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">Manage</button>
            </div>
            <p className="text-xs text-gray-400">123 Main St, Downtown</p>
            <div className="flex justify-between mt-2 text-sm">
              <span>8 Ports</span>
              <span>5 Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, percentage, timeframe, isDollar = false }) {
  const isPositive = percentage.startsWith('+');
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-sm text-gray-400 mb-2">{title}</h2>
      <div className="flex items-baseline">
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="mt-2 flex items-center text-xs">
        <span className={isPositive ? 'text-green-500' : 'text-red-500'}>{percentage}</span>
        <span className="text-gray-400 ml-1">{timeframe}</span>
      </div>
    </div>
  );
}
