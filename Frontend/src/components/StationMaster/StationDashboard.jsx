import React from 'react';
import { Users, Zap, Activity, Battery, AlertTriangle, Clock, MessageCircle } from 'lucide-react';

export default function StationDashboard() {
  const chargers = [
    { id: 'CH-001', status: 'Available', progress: null },
    { id: 'CH-002', status: 'In Use', progress: 75 },
    { id: 'CH-003', status: 'In Use', progress: 45 },
    { id: 'CH-004', status: 'Available', progress: null },
    { id: 'CH-005', status: 'Maintenance', progress: null },
    { id: 'CH-006', status: 'In Use', progress: 90 }
  ];

  const issues = [
    { type: 'error', title: 'Charger CH-005 offline', time: '10:30 AM', icon: AlertTriangle },
    { type: 'warning', title: 'Payment system slow response', time: '09:15 AM', icon: Clock },
    { type: 'info', title: 'Customer complaint - CH-003', time: '08:45 AM', icon: MessageCircle }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700 border-green-200';
      case 'In Use': return 'bg-gray-800 text-white';
      case 'Maintenance': return 'bg-red-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIssueColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-500';
      case 'warning': return 'text-amber-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen w-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Station Dashboard</h1>
          <p className="text-gray-500">Overview of your station's performance and status</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600 text-sm">Users Today</div>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">142</div>
            <div className="text-sm text-gray-500">+12% from yesterday</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600 text-sm">Active Chargers</div>
              <Zap className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">8/12</div>
            <div className="text-sm text-gray-500">67% from yesterday</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600 text-sm">Sessions Completed</div>
              <Activity className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">89</div>
            <div className="text-sm text-gray-500">+8% from yesterday</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600 text-sm">Energy Dispensed</div>
              <Battery className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">1,247 kWh</div>
            <div className="text-sm text-gray-500">+15% from yesterday</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-8">
          {/* Charger Status */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Charger Status</h2>
              <p className="text-gray-500 text-sm">Real-time status of all charging points</p>
            </div>
            
            <div className="space-y-4">
              {chargers.map((charger) => (
                <div key={charger.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-900 w-16">{charger.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(charger.status)}`}>
                      {charger.status}
                    </span>
                  </div>
                  
                  {charger.progress && (
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${charger.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 font-medium w-8 text-right">
                        {charger.progress}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Issues */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Recent Issues</h2>
              <p className="text-gray-500 text-sm">Latest alerts and downtime logs</p>
            </div>
            
            <div className="space-y-5">
              {issues.map((issue, index) => {
                const IconComponent = issue.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`p-1 ${getIssueColor(issue.type)}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-900 font-medium text-sm mb-1">{issue.title}</div>
                      <div className="text-gray-400 text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {issue.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}